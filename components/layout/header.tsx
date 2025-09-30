'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import AuthButtons from '@/components/auth/auth-buttons';
import UserDropdown from '@/components/auth/user-dropdown';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 데모용 로그인 상태
  const [userName, setUserName] = useState('홍길동');
  const pathname = usePathname();

  const navItems = [
    { name: '회사소개', href: '/about' },
    { name: '상품', href: '/products' },
  ];

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b border-white/20 shadow-lg shadow-black/5">
      <nav className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center h-12">
            <Image
              src="/logo.png"
              alt="Logo"
              width={200}
              height={48}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center space-x-2 absolute left-1/2 transform -translate-x-1/2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-white/20'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Right: Auth Buttons or User Dropdown */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <UserDropdown userName={userName} onLogout={handleLogout} />
            ) : (
              <AuthButtons />
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-900/90 hover:bg-white/20 transition-colors"
            aria-label="메뉴"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <div className="backdrop-blur-xl bg-white/95 border border-white/20 shadow-2xl rounded-lg p-4 space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                      isActive
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-900/90 hover:text-blue-600 hover:bg-white/40'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <div className="h-px bg-gray-300 my-2"></div>
              {isLoggedIn ? (
                <>
                  <div className="px-4 py-2 text-gray-900 font-medium">
                    {userName}
                  </div>
                  <Link
                    href="/profile"
                    className="block px-4 py-3 rounded-lg font-medium text-gray-900 hover:text-blue-600 hover:bg-white/40 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    내 프로필
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-3 rounded-lg font-medium text-gray-900 hover:text-blue-600 hover:bg-white/40 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    설정
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-4 py-3 rounded-lg font-medium text-gray-900 hover:text-blue-600 hover:bg-white/40 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    로그인
                  </Link>
                  <Link
                    href="/signup"
                    className="block px-4 py-3 rounded-lg font-medium bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-gray-900 transition-all text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    회원가입
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}