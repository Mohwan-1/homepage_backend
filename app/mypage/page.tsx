'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { User, ShoppingBag, CreditCard, Settings, Package, Clock, CheckCircle } from 'lucide-react';

interface UserData {
  email: string;
  name: string;
  role: string;
}

const recentOrders = [
  {
    id: '1',
    orderNumber: 'ORD-20240115-001',
    date: '2024-01-15',
    status: 'delivered',
    items: 2,
    amount: 125000
  },
  {
    id: '2',
    orderNumber: 'ORD-20240110-002',
    date: '2024-01-10',
    status: 'shipping',
    items: 1,
    amount: 89000
  },
  {
    id: '3',
    orderNumber: 'ORD-20240105-003',
    date: '2024-01-05',
    status: 'delivered',
    items: 3,
    amount: 256000
  }
];

const quickActions = [
  { title: '내 정보 관리', href: '/mypage/profile', icon: User, color: 'blue' },
  { title: '주문/배송 조회', href: '/mypage/orders', icon: ShoppingBag, color: 'green' },
  { title: '포인트 내역', href: '/mypage/points', icon: CreditCard, color: 'purple' },
  { title: '고객센터', href: '/support', icon: Settings, color: 'orange' }
];

export default function MypageDashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      setUserData(JSON.parse(userDataStr));
    }
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      delivered: { label: '배송완료', color: 'bg-green-100 text-green-600' },
      shipping: { label: '배송중', color: 'bg-blue-100 text-blue-600' },
      paid: { label: '결제완료', color: 'bg-purple-100 text-purple-600' },
      pending: { label: '결제대기', color: 'bg-gray-100 text-gray-600' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return config;
  };

  return (
    <div className="space-y-6">
      {/* User Info Summary Card */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <User size={40} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800">{userData?.name || '사용자'}</h2>
            <p className="text-gray-600">{userData?.email}</p>
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
              <span>가입일: 2024-01-01</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded">일반 회원</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">총 주문</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">12건</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingBag size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">포인트</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">2,500P</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <CreditCard size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">배송중</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">1건</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Package size={24} className="text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">최근 주문</h3>
          <Link href="/mypage/orders" className="text-sm text-blue-600 hover:text-blue-700">
            전체보기
          </Link>
        </div>
        <div className="divide-y divide-gray-200">
          {recentOrders.map((order) => {
            const statusBadge = getStatusBadge(order.status);
            return (
              <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-medium text-gray-800">{order.orderNumber}</p>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${statusBadge.color}`}>
                        {statusBadge.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {order.date}
                      </span>
                      <span>{order.items}개 상품</span>
                      <span className="font-medium text-gray-800">₩{order.amount.toLocaleString()}</span>
                    </div>
                  </div>
                  <Link
                    href={`/mypage/orders/${order.id}`}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    상세보기
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">빠른 메뉴</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            const colorClasses = {
              blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
              green: 'bg-green-50 text-green-600 hover:bg-green-100',
              purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
              orange: 'bg-orange-50 text-orange-600 hover:bg-orange-100'
            };
            return (
              <Link
                key={action.href}
                href={action.href}
                className={`flex flex-col items-center justify-center p-6 rounded-lg transition-colors ${
                  colorClasses[action.color as keyof typeof colorClasses]
                }`}
              >
                <Icon size={32} className="mb-2" />
                <span className="text-sm font-medium text-center">{action.title}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">알림</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
            <CheckCircle size={20} className="text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-gray-800">주문이 배송 완료되었습니다</p>
              <p className="text-sm text-gray-600 mt-1">주문번호: ORD-20240115-001</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
            <CheckCircle size={20} className="text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-gray-800">포인트 2,500P가 적립되었습니다</p>
              <p className="text-sm text-gray-600 mt-1">구매 감사 포인트</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}