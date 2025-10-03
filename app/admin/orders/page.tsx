'use client';

import { useState, useEffect } from 'react';
import DataTable, { ColumnDef, TableAction } from '@/components/admin/data-table';
import { Search, Calendar } from 'lucide-react';
import { collection, getDocs, query, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type OrderStatus =
  | 'pending'
  | 'paid'
  | 'preparing'
  | 'shipping'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

interface OrderData {
  id: string;
  orderNumber: string;
  customerName: string;
  orderDate: string;
  status: OrderStatus;
  amount: number;
  items: number;
}

const statusConfig = {
  pending: { label: '결제대기', color: 'bg-gray-100 text-gray-600' },
  paid: { label: '결제완료', color: 'bg-green-100 text-green-600' },
  preparing: { label: '배송준비', color: 'bg-yellow-100 text-yellow-600' },
  shipping: { label: '배송중', color: 'bg-blue-100 text-blue-600' },
  delivered: { label: '배송완료', color: 'bg-purple-100 text-purple-600' },
  cancelled: { label: '취소', color: 'bg-red-100 text-red-600' },
  refunded: { label: '환불', color: 'bg-orange-100 text-orange-600' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const ordersQuery = query(
        collection(db, 'orders'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(ordersQuery);
      const ordersData: OrderData[] = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          orderNumber: data.orderId || doc.id,
          customerName: data.customerName || data.userName || 'Unknown',
          orderDate: data.createdAt ? new Date(data.createdAt).toLocaleDateString('ko-KR') : '-',
          status: data.status || 'pending',
          amount: data.totalAmount || 0,
          items: data.items?.length || 0
        };
      });
      setOrders(ordersData);
    } catch (error) {
      console.error('Failed to load orders:', error);
      alert('주문 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    const matchesDate =
      (!dateFrom || order.orderDate >= dateFrom) &&
      (!dateTo || order.orderDate <= dateTo);

    return matchesSearch && matchesStatus && matchesDate;
  });

  const columns: ColumnDef<OrderData>[] = [
    {
      key: 'orderNumber',
      header: '주문번호',
      sortable: true,
    },
    {
      key: 'customerName',
      header: '고객명',
      sortable: true,
    },
    {
      key: 'orderDate',
      header: '주문일',
      sortable: true,
    },
    {
      key: 'items',
      header: '상품수',
      sortable: true,
      render: (value) => `${value}개`,
    },
    {
      key: 'amount',
      header: '금액',
      sortable: true,
      render: (value) => `₩${value.toLocaleString()}`,
    },
    {
      key: 'status',
      header: '상태',
      sortable: true,
      render: (value: OrderStatus) => {
        const config = statusConfig[value];
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded ${config.color}`}>
            {config.label}
          </span>
        );
      },
    },
  ];

  const changeOrderStatus = async (order: OrderData, newStatus: OrderStatus) => {
    try {
      await updateDoc(doc(db, 'orders', order.id), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      await loadOrders();
      alert(`주문 상태가 ${statusConfig[newStatus].label}(으)로 변경되었습니다.`);
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('주문 상태 변경에 실패했습니다.');
    }
  };

  const actions: TableAction<OrderData>[] = [
    {
      label: '상세보기',
      onClick: (order) => alert(`주문번호: ${order.orderNumber}\n고객: ${order.customerName}\n상품수: ${order.items}개\n금액: ₩${order.amount.toLocaleString()}\n상태: ${statusConfig[order.status].label}`),
    },
    {
      label: '상태변경',
      onClick: (order) => {
        const statusOptions: OrderStatus[] = ['paid', 'preparing', 'shipping', 'delivered'];
        const currentIndex = statusOptions.indexOf(order.status);
        if (currentIndex < statusOptions.length - 1 && currentIndex >= 0) {
          const nextStatus = statusOptions[currentIndex + 1];
          if (confirm(`${order.orderNumber}의 상태를 ${statusConfig[nextStatus].label}(으)로 변경하시겠습니까?`)) {
            changeOrderStatus(order, nextStatus);
          }
        } else if (order.status === 'delivered') {
          alert('이미 배송 완료된 주문입니다.');
        } else {
          alert('이 주문의 상태를 변경할 수 없습니다.');
        }
      },
    },
    {
      label: '취소',
      onClick: (order) => {
        if (order.status === 'delivered') {
          alert('배송 완료된 주문은 취소할 수 없습니다. 환불 처리를 진행하세요.');
          return;
        }
        if (confirm(`${order.orderNumber}을(를) 취소하시겠습니까?`)) {
          changeOrderStatus(order, 'cancelled');
        }
      },
      variant: 'destructive',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">주문 목록 로딩 중...</p>
        </div>
      </div>
    );
  }

  const totalRevenue = filteredOrders
    .filter(o => o.status !== 'cancelled' && o.status !== 'refunded')
    .reduce((sum, order) => sum + order.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">주문 관리</h1>
          <p className="text-gray-600 mt-1">
            총 {filteredOrders.length}건 | 총 매출 ₩{totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="주문번호/고객명..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="all">모든 상태</option>
              <option value="pending">결제대기</option>
              <option value="paid">결제완료</option>
              <option value="preparing">배송준비</option>
              <option value="shipping">배송중</option>
              <option value="delivered">배송완료</option>
              <option value="cancelled">취소</option>
              <option value="refunded">환불</option>
            </select>
          </div>

          {/* Date From */}
          <div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Date To */}
          <div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = orders.filter(o => o.status === status).length;
          return (
            <div key={status} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className={`text-xs font-medium mb-1 px-2 py-1 rounded inline-block ${config.color}`}>
                {config.label}
              </div>
              <p className="text-2xl font-bold text-gray-800 mt-2">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredOrders}
        columns={columns}
        actions={actions}
        onRowClick={(order) => console.log('Order clicked:', order)}
      />
    </div>
  );
}