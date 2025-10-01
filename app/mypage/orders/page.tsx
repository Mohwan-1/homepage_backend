'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Clock, ChevronRight, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderId: string;
  createdAt: any;
  status: 'pending' | 'paid' | 'shipping' | 'delivered' | 'cancelled';
  items: OrderItem[];
  totalAmount: number;
}

export default function OrdersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [period, setPeriod] = useState('3months');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'shipping' | 'delivered' | 'cancelled'>('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user, period]);

  const loadOrders = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Calculate date range based on period
      const now = new Date();
      const periodDays = {
        '1month': 30,
        '3months': 90,
        '6months': 180,
        '1year': 365
      }[period] || 90;

      const startDate = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);

      const ordersQuery = query(
        collection(db, 'orders'),
        where('userId', '==', user.uid),
        where('createdAt', '>=', Timestamp.fromDate(startDate)),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(ordersQuery);
      const ordersData: Order[] = [];

      querySnapshot.forEach((doc) => {
        ordersData.push({
          id: doc.id,
          ...doc.data(),
        } as Order);
      });

      setOrders(ordersData);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (statusFilter === 'all') return true;
    return order.status === statusFilter;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: '결제대기', color: 'bg-gray-100 text-gray-600' },
      paid: { label: '결제완료', color: 'bg-green-100 text-green-600' },
      shipping: { label: '배송중', color: 'bg-blue-100 text-blue-600' },
      delivered: { label: '배송완료', color: 'bg-purple-100 text-purple-600' },
      cancelled: { label: '취소', color: 'bg-red-100 text-red-600' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return config;
  };

  return (
    <div className="space-y-6">
      {/* Navigation Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>뒤로가기</span>
        </button>
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Home size={20} />
          <span>홈으로</span>
        </button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-800">주문내역</h1>
        <p className="text-gray-600 mt-1">주문한 상품의 배송 상태를 확인할 수 있습니다</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Period Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">기간</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="1month">1개월</option>
              <option value="3months">3개월</option>
              <option value="6months">6개월</option>
              <option value="1year">1년</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="all">전체</option>
              <option value="paid">결제완료</option>
              <option value="shipping">배송중</option>
              <option value="delivered">배송완료</option>
              <option value="cancelled">취소</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">주문 내역을 불러오는 중...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-12 text-center">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">주문 내역이 없습니다</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusBadge = getStatusBadge(order.status);
            const orderDate = order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString('ko-KR') : '-';

            return (
              <div key={order.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock size={16} />
                        <span>{orderDate}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-800">{order.orderId}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${statusBadge.color}`}>
                        {statusBadge.label}
                      </span>
                    </div>
                    <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
                      상세보기
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package size={32} className="text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{item.productName}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            수량: {item.quantity}개 | ₩{item.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Total */}
                  <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-gray-600">총 결제금액</span>
                    <span className="text-xl font-bold text-gray-800">
                      ₩{order.totalAmount.toLocaleString()}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex gap-2">
                    {order.status === 'delivered' && (
                      <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        리뷰 작성
                      </button>
                    )}
                    {order.status === 'paid' && (
                      <button className="flex-1 px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                        주문 취소
                      </button>
                    )}
                    <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      재구매
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}