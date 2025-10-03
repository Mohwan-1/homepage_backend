'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, ShoppingCart, Package, DollarSign, TrendingUp, TrendingDown, Settings, MessageSquare } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface DashboardMetric {
  title: string;
  value: number | string;
  change?: number;
  icon: any;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

interface RecentUser {
  id: string;
  name: string;
  email: string;
  date: string;
}

interface RecentOrder {
  id: string;
  orderId: string;
  customer: string;
  amount: string;
  status: string;
}

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
  orange: 'bg-orange-100 text-orange-600'
};

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // 사용자 데이터 로드
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const totalUsers = usersSnapshot.size;

      // 오늘 가입자 수 계산
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const newUsersToday = usersSnapshot.docs.filter(doc => {
        const createdAt = new Date(doc.data().createdAt);
        return createdAt >= today;
      }).length;

      // 주문 데이터 로드
      const ordersSnapshot = await getDocs(collection(db, 'orders'));
      const totalOrders = ordersSnapshot.size;

      // 총 매출 계산
      const totalRevenue = ordersSnapshot.docs.reduce((sum, doc) => {
        const status = doc.data().status;
        if (status !== 'cancelled' && status !== 'refunded') {
          return sum + (doc.data().totalAmount || 0);
        }
        return sum;
      }, 0);

      // 메트릭 설정
      setMetrics([
        {
          title: '총 사용자 수',
          value: totalUsers.toLocaleString(),
          change: 12.5,
          icon: Users,
          color: 'blue'
        },
        {
          title: '오늘 신규 가입자',
          value: newUsersToday.toString(),
          change: 8.2,
          icon: Users,
          color: 'green'
        },
        {
          title: '총 주문 수',
          value: totalOrders.toLocaleString(),
          change: -3.1,
          icon: ShoppingCart,
          color: 'purple'
        },
        {
          title: '총 매출액',
          value: `₩${totalRevenue.toLocaleString()}`,
          change: 15.3,
          icon: DollarSign,
          color: 'orange'
        }
      ]);

      // 최근 가입자 (최근 5명)
      const recentUsersQuery = query(
        collection(db, 'users'),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      const recentUsersSnapshot = await getDocs(recentUsersQuery);
      const usersData = recentUsersSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name || 'Unknown',
        email: doc.data().email,
        date: new Date(doc.data().createdAt).toLocaleDateString('ko-KR')
      }));
      setRecentUsers(usersData);

      // 최근 주문 (최근 5개)
      const recentOrdersQuery = query(
        collection(db, 'orders'),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      const recentOrdersSnapshot = await getDocs(recentOrdersQuery);
      const ordersData = recentOrdersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          orderId: data.orderId || doc.id,
          customer: data.customerName || data.userName || 'Unknown',
          amount: `₩${(data.totalAmount || 0).toLocaleString()}`,
          status: getStatusLabel(data.status)
        };
      });
      setRecentOrders(ordersData);

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: '결제대기',
      paid: '결제완료',
      preparing: '배송준비',
      shipping: '배송중',
      delivered: '배송완료',
      cancelled: '취소',
      refunded: '환불'
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">데이터 로딩 중...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">대시보드</h1>
        <p className="text-gray-600 mt-1">관리자 시스템 주요 지표 및 활동 현황</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.title} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${colorClasses[metric.color]}`}>
                  <Icon size={24} />
                </div>
                {metric.change && (
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    metric.change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {Math.abs(metric.change)}%
                  </div>
                )}
              </div>
              <h3 className="text-gray-600 text-sm mb-1">{metric.title}</h3>
              <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts - 임시 비활성화 (실제 데이터 집계 후 구현) */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4">월별 매출 추이</h2>
          <p className="text-gray-500 text-center py-12">데이터 집계 중...</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4">상품별 판매량</h2>
          <p className="text-gray-500 text-center py-12">데이터 집계 중...</p>
        </div>
      </div> */}

      {/* Recent Activity Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">최근 가입자</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">이름</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">이메일</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">가입일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentUsers.length > 0 ? (
                  recentUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800">{user.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                      가입자가 없습니다
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">최근 주문</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">주문번호</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">고객명</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">금액</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{order.orderId}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.customer}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{order.amount}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded">
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      주문 내역이 없습니다
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-4">빠른 액션</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Link
            href="/admin/users"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Users size={20} />
            사용자 관리
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Package size={20} />
            상품 관리
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <ShoppingCart size={20} />
            주문 관리
          </Link>
          <Link
            href="/admin/reviews"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <MessageSquare size={20} />
            후기 관리
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Settings size={20} />
            시스템 설정
          </Link>
        </div>
      </div>
    </div>
  );
}