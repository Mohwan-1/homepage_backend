'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

const routeNames: { [key: string]: string } = {
  '/admin': '대시보드',
  '/admin/users': '사용자 관리',
  '/admin/products': '상품 관리',
  '/admin/orders': '주문 관리',
  '/admin/settings': '시스템 설정',
};

export default function AdminBreadcrumb() {
  const pathname = usePathname();

  const pathSegments = pathname.split('/').filter((segment) => segment !== '');

  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    const name = routeNames[path] || segment;
    return { path, name };
  });

  return (
    <nav className="flex items-center gap-2 text-sm mb-6">
      <Link
        href="/admin"
        className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
      >
        <Home size={16} />
        <span>홈</span>
      </Link>

      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return (
          <div key={crumb.path} className="flex items-center gap-2">
            <ChevronRight size={16} className="text-gray-400" />
            {isLast ? (
              <span className="text-gray-700 font-medium">{crumb.name}</span>
            ) : (
              <Link
                href={crumb.path}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                {crumb.name}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}