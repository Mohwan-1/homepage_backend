'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const { user, userData, loading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // 로딩 중이면 아무것도 하지 않음
    if (loading) {
      console.log('AdminGuard: 로딩 중...');
      return;
    }

    console.log('AdminGuard 체크:', { user: user?.email, userData, loading });

    // 로그인하지 않은 경우
    if (!user) {
      console.log('AdminGuard: 로그인 필요');
      alert('로그인이 필요합니다.');
      router.push('/');
      return;
    }

    // userData가 로드되지 않은 경우 (로딩 완료 후에도)
    if (!userData) {
      console.log('AdminGuard: userData 없음, 잠시 대기...');
      return;
    }

    // 관리자가 아닌 경우
    if (userData.role !== 'admin') {
      console.log('AdminGuard: 관리자 권한 없음', userData.role);
      alert('관리자 권한이 필요합니다.');
      router.push('/');
      return;
    }

    console.log('AdminGuard: 관리자 권한 확인 완료', userData);
    setIsAuthorized(true);
  }, [user, userData, loading, router]);

  // 로딩 중이거나 userData 로딩 대기 중
  if (loading || (user && !userData)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">권한 확인 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}