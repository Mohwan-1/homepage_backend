'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, ShoppingBag, Settings } from 'lucide-react';

interface MenuItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const sidebarItems: MenuItem[] = [
  {
    title: '마이페이지',
    href: '/mypage',
    icon: Home
  },
  {
    title: '내 정보',
    href: '/mypage/profile',
    icon: User
  },
  {
    title: '주문내역',
    href: '/mypage/orders',
    icon: ShoppingBag
  },
  {
    title: '설정',
    href: '/mypage/settings',
    icon: Settings
  }
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <div className="space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600 font-medium'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-blue-600' : 'text-gray-500'} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}