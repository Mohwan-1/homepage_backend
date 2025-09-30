'use client';

import { Users, ShoppingCart, Package, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardMetric {
  title: string;
  value: number | string;
  change?: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

const metrics: DashboardMetric[] = [
  {
    title: '총 사용자 수',
    value: '1,234',
    change: 12.5,
    icon: Users,
    color: 'blue'
  },
  {
    title: '오늘 신규 가입자',
    value: '28',
    change: 8.2,
    icon: Users,
    color: 'green'
  },
  {
    title: '총 주문 수',
    value: '856',
    change: -3.1,
    icon: ShoppingCart,
    color: 'purple'
  },
  {
    title: '총 매출액',
    value: '₩12,450,000',
    change: 15.3,
    icon: DollarSign,
    color: 'orange'
  }
];

const salesData = [
  { month: '1월', sales: 4000 },
  { month: '2월', sales: 3000 },
  { month: '3월', sales: 5000 },
  { month: '4월', sales: 4500 },
  { month: '5월', sales: 6000 },
  { month: '6월', sales: 7000 },
];

const productData = [
  { product: '상품 A', sales: 400 },
  { product: '상품 B', sales: 300 },
  { product: '상품 C', sales: 200 },
  { product: '상품 D', sales: 278 },
  { product: '상품 E', sales: 189 },
];

const recentUsers = [
  { id: 1, name: '김철수', email: 'kim@example.com', date: '2024-01-15' },
  { id: 2, name: '이영희', email: 'lee@example.com', date: '2024-01-15' },
  { id: 3, name: '박민수', email: 'park@example.com', date: '2024-01-14' },
  { id: 4, name: '정수진', email: 'jung@example.com', date: '2024-01-14' },
  { id: 5, name: '최지훈', email: 'choi@example.com', date: '2024-01-13' },
];

const recentOrders = [
  { id: 'ORD-001', customer: '김철수', amount: '₩125,000', status: '배송중' },
  { id: 'ORD-002', customer: '이영희', amount: '₩89,000', status: '결제완료' },
  { id: 'ORD-003', customer: '박민수', amount: '₩256,000', status: '배송완료' },
  { id: 'ORD-004', customer: '정수진', amount: '₩45,000', status: '배송준비' },
  { id: 'ORD-005', customer: '최지훈', amount: '₩178,000', status: '배송중' },
];

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
  orange: 'bg-orange-100 text-orange-600'
};

export default function AdminDashboard() {
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4">월별 매출 추이</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} name="매출" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Product Sales Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4">상품별 판매량</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="product" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#8b5cf6" name="판매량" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

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
                {recentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.date}</td>
                  </tr>
                ))}
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
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.customer}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{order.amount}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-4">빠른 액션</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Users size={20} />
            사용자 관리
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Package size={20} />
            상품 관리
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <ShoppingCart size={20} />
            주문 관리
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            <Package size={20} />
            시스템 설정
          </button>
        </div>
      </div>
    </div>
  );
}