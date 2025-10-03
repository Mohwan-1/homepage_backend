'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import UserDropdown from '@/components/auth/user-dropdown';
import Modal from '@/components/ui/modal';
import LoginForm from '@/components/auth/login-form';
import SignupForm from '@/components/auth/signup-form';

export default function Header() {
  const { user, userData, signOut: firebaseSignOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: '회사소개', href: '/about' },
    { name: '상품', href: '/products' },
    { name: '후기', href: '/reviews' },
  ];

  const loggedInNavItems = [
    { name: '회사소개', href: '/about' },
    { name: '상품', href: '/products' },
    { name: '후기', href: '/reviews' },
    { name: '마이페이지', href: '/mypage' },
  ];

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
  };

  const handleSignupSuccess = () => {
    setIsSignupModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      await firebaseSignOut();
      localStorage.removeItem('userData');
      localStorage.removeItem('cart');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const switchToSignup = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  };

  const switchToLogin = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
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
            {(user ? loggedInNavItems : navItems).map((item) => {
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
            {user ? (
              <>
                {userData?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    관리자페이지
                  </Link>
                )}
                <UserDropdown userName={userData?.name || user.email || '사용자'} onLogout={handleLogout} />
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    console.log('🔷 로그인 버튼 클릭 - 모달 열기');
                    setIsLoginModalOpen(true);
                  }}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  로그인
                </button>
                {/* 회원가입 버튼 숨김 - 로그인 모달 하단에서 접근 가능 */}
                {/* <button
                  onClick={() => setIsSignupModalOpen(true)}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-gray-900 px-4 py-2 rounded-lg font-medium transition-all"
                >
                  회원가입
                </button> */}
              </>
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
              {(user ? loggedInNavItems : navItems).map((item) => {
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
              {user ? (
                <>
                  <div className="px-4 py-2 text-gray-900 font-medium">
                    {userData?.name || user.email}
                  </div>
                  {userData?.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="block px-4 py-3 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      관리자페이지
                    </Link>
                  )}
                  <Link
                    href="/mypage"
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
                  <button
                    onClick={() => {
                      setIsLoginModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 rounded-lg font-medium text-gray-900 hover:text-blue-600 hover:bg-white/40 transition-colors duration-200"
                  >
                    로그인
                  </button>
                  {/* 모바일 회원가입 버튼 숨김 - 로그인 모달 하단에서 접근 가능 */}
                  {/* <button
                    onClick={() => {
                      setIsSignupModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="block w-full px-4 py-3 rounded-lg font-medium bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-gray-900 transition-all text-center"
                  >
                    회원가입
                  </button> */}
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Login Modal */}
      <Modal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title="로그인"
      >
        <LoginForm
          onSuccess={handleLoginSuccess}
          onSwitchToSignup={switchToSignup}
        />
      </Modal>

      {/* Signup Modal */}
      <Modal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        title="회원가입"
      >
        <SignupForm
          onSuccess={handleSignupSuccess}
          onSwitchToLogin={switchToLogin}
        />
      </Modal>
    </header>
  );
}