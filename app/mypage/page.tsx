'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { User, ShoppingBag, CreditCard, Settings, Package, Clock, CheckCircle, ArrowLeft, Home, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Order {
  id: string;
  orderId: string;
  totalAmount: number;
  status: string;
  createdAt: any;
  items: any[];
}

const quickActions = [
  { title: '내 정보 관리', href: '/mypage/profile', icon: User, color: 'blue' },
  { title: '주문/배송 조회', href: '/mypage/orders', icon: ShoppingBag, color: 'green' },
  { title: '후기 수정', href: '/mypage/reviews', icon: MessageSquare, color: 'purple' },
  { title: '고객센터', href: '/support', icon: Settings, color: 'orange' }
];

export default function MypageDashboard() {
  const { user, userData } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    points: 0,
    shippingOrders: 0
  });

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    if (!user) {
      console.log('⚠️ loadOrders: user 없음');
      return;
    }

    try {
      console.log('🔄 주문 내역 로딩 중... userId:', user.uid);

      // userId로만 필터링 (인덱스 불필요)
      const ordersQuery = query(
        collection(db, 'orders'),
        where('userId', '==', user.uid)
      );

      const querySnapshot = await getDocs(ordersQuery);
      const ordersData: Order[] = [];

      querySnapshot.forEach((doc) => {
        console.log('📦 주문 문서 발견:', doc.id, doc.data());
        ordersData.push({
          id: doc.id,
          ...doc.data(),
        } as Order);
      });

      console.log('✅ 전체 주문 로드 완료:', ordersData.length, '건');

      // 클라이언트에서 정렬하여 최근 3개만 표시
      const sortedOrders = ordersData.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
        return dateB - dateA;
      }).slice(0, 3);

      console.log('📋 최근 3개 주문:', sortedOrders);
      setOrders(sortedOrders);

      // 통계 계산
      const totalOrders = ordersData.length;
      const shippingOrders = ordersData.filter(
        order => order.status === 'shipping'
      ).length;

      console.log('📊 통계:', { totalOrders, shippingOrders });

      setStats({
        totalOrders,
        points: 2500, // TODO: 포인트 시스템 구현 시 실제 데이터로 변경
        shippingOrders
      });
    } catch (error: any) {
      console.error('❌ Failed to load orders:', error);
      console.error('❌ Error details:', error.message, error.code);
    }
  };

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
      {/* Navigation Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>뒤로가기</span>
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Home size={20} />
          <span>홈으로</span>
        </Link>
      </div>

      {/* User Info Summary Card */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <User size={40} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800">{userData?.name || user?.email || '사용자'}</h2>
            <p className="text-gray-600">{user?.email}</p>
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
              <span>가입일: {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('ko-KR') : '-'}</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded">
                {userData?.role === 'admin' ? '관리자' : '일반 회원'}
              </span>
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
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalOrders}건</p>
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
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.points.toLocaleString()}P</p>
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
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.shippingOrders}건</p>
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
          {orders.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Package size={48} className="mx-auto mb-4 text-gray-300" />
              <p>주문 내역이 없습니다.</p>
              <Link
                href="/products"
                className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                상품 둘러보기
              </Link>
            </div>
          ) : (
            orders.map((order) => {
              const statusBadge = getStatusBadge(order.status);
              const orderDate = order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString('ko-KR') : '-';

              return (
                <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-medium text-gray-800">{order.orderId}</p>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${statusBadge.color}`}>
                          {statusBadge.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {orderDate}
                        </span>
                        <span>{order.items?.length || 0}개 상품</span>
                        <span className="font-medium text-gray-800">₩{order.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                    <Link
                      href={`/mypage/orders`}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      상세보기
                    </Link>
                  </div>
                </div>
              );
            })
          )}
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