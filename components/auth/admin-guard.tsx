'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        // TODO: Firebase 인증 연동
        // const user = auth.currentUser;
        // if (!user) {
        //   router.push('/');
        //   return;
        // }

        // const tokenResult = await user.getIdTokenResult();
        // const isAdmin = tokenResult.claims.role === 'admin';

        // 임시 데모 로직 - localStorage에서 사용자 정보 확인
        const userDataStr = localStorage.getItem('userData');
        if (!userDataStr) {
          router.push('/');
          return;
        }

        const userData = JSON.parse(userDataStr);
        const isAdmin = userData.role === 'admin';

        if (!isAdmin) {
          alert('관리자 권한이 필요합니다.');
          router.push('/');
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Admin access check failed:', error);
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAccess();
  }, [router]);

  if (isLoading) {
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