'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Users, Package, ShoppingCart, Settings, MessageSquare } from 'lucide-react';

interface MenuItem {
  title: string;
  href: string;
  icon: any;
}

const adminMenuItems: MenuItem[] = [
  {
    title: '대시보드',
    href: '/admin',
    icon: BarChart3
  },
  {
    title: '사용자 관리',
    href: '/admin/users',
    icon: Users
  },
  {
    title: '상품 관리',
    href: '/admin/products',
    icon: Package
  },
  {
    title: '주문 관리',
    href: '/admin/orders',
    icon: ShoppingCart
  },
  {
    title: '후기 관리',
    href: '/admin/reviews',
    icon: MessageSquare
  },
  {
    title: '시스템 설정',
    href: '/admin/settings',
    icon: Settings
  }
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800">관리자 패널</h2>
      </div>

      <nav className="px-3">
        {adminMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 mb-1 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-blue-600' : 'text-gray-500'} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}