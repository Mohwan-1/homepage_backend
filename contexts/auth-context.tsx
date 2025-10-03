'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  getRedirectResult,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface UserData {
  uid: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let unsubscribe: (() => void) | undefined;

    const initAuth = async () => {
      // Auth 상태 변경 리스너 먼저 등록 (중요!)
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log('🔔 Auth state changed:', user?.email || '로그아웃 상태');

        if (!mounted) return;

        if (user) {
          console.log('👤 Firebase Auth 사용자:', user.uid);
          setUser(user);

          // Firestore에서 사용자 데이터 가져오기
          try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));

            if (userDoc.exists()) {
              const data = userDoc.data() as UserData;
              console.log('✅ Firestore 사용자 데이터 로드:', data);
              setUserData(data);
            } else {
              console.warn('⚠️ Firestore에 사용자 데이터 없음 - 생성 중...');
              // Google 로그인 직후일 수 있으므로 기본 데이터 생성
              const defaultData: UserData = {
                uid: user.uid,
                email: user.email!,
                name: user.displayName || user.email!.split('@')[0],
                role: 'user',
                createdAt: new Date().toISOString(),
              };

              await setDoc(doc(db, 'users', user.uid), defaultData);
              console.log('📝 Firestore 사용자 데이터 생성 완료:', defaultData);
              setUserData(defaultData);
            }
          } catch (error) {
            console.error('❌ Firestore 데이터 로드 실패:', error);
          }
        } else {
          console.log('🚪 로그아웃 상태');
          setUser(null);
          setUserData(null);
        }

        setLoading(false);
      });

      // 리다이렉트 결과 확인 (비동기로 별도 처리)
      try {
        console.log('🔄 Google 리다이렉트 결과 확인 중...');
        const result = await getRedirectResult(auth);

        if (result?.user) {
          console.log('✅ Google 로그인 리다이렉트 성공:', result.user.email);

          // Firestore에 데이터가 없으면 생성 (onAuthStateChanged에서도 처리되지만 중복 방지)
          const userDoc = await getDoc(doc(db, 'users', result.user.uid));

          if (!userDoc.exists()) {
            const newUserData: UserData = {
              uid: result.user.uid,
              email: result.user.email!,
              name: result.user.displayName || result.user.email!.split('@')[0],
              role: 'user',
              createdAt: new Date().toISOString(),
            };

            console.log('📝 Google 신규 사용자 Firestore 저장:', newUserData);
            await setDoc(doc(db, 'users', result.user.uid), newUserData);
          }
        } else {
          console.log('ℹ️ 리다이렉트 결과 없음 (일반 페이지 로드)');
        }
      } catch (error: any) {
        console.error('❌ Redirect result error:', error);
      }
    };

    initAuth();

    return () => {
      mounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(getErrorMessage(error.code));
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 프로필 업데이트
      await updateProfile(user, { displayName: name });

      // Firestore에 사용자 데이터 저장
      const newUserData: UserData = {
        uid: user.uid,
        email: user.email!,
        name,
        role: 'user',
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', user.uid), newUserData);
      setUserData(newUserData);
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(getErrorMessage(error.code));
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log('🔵 Google 로그인 시작...');
      console.log('🌐 현재 도메인:', typeof window !== 'undefined' ? window.location.hostname : 'SSR');

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      console.log('🔵 Provider 설정 완료, 팝업 방식으로 로그인...');

      // 팝업 방식으로 변경 (localhost에서 더 안정적)
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log('✅ Google 로그인 성공:', user.email);

      // Firestore에 사용자 데이터 저장
      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (!userDoc.exists()) {
        const newUserData: UserData = {
          uid: user.uid,
          email: user.email!,
          name: user.displayName || user.email!.split('@')[0],
          role: 'user',
          createdAt: new Date().toISOString(),
        };

        console.log('📝 신규 사용자 Firestore 저장:', newUserData);
        await setDoc(doc(db, 'users', user.uid), newUserData);
        setUserData(newUserData);
      } else {
        const existingData = userDoc.data() as UserData;
        console.log('📂 기존 사용자 데이터 로드:', existingData);
        setUserData(existingData);
      }

      console.log('🎉 Google 로그인 완료!');
    } catch (error: any) {
      console.error('❌ Google sign in error:', error);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error message:', error.message);
      console.error('❌ Full error:', JSON.stringify(error, null, 2));

      // 인증 도메인 오류 처리
      if (error.code === 'auth/unauthorized-domain') {
        const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'unknown';
        throw new Error(`인증 오류: 현재 도메인 "${currentDomain}"이 Firebase 승인된 도메인에 없습니다.\n\nFirebase Console > Authentication > Settings > Authorized domains에서\n"${currentDomain}"을 추가해주세요.`);
      }

      // 팝업 차단 오류
      if (error.code === 'auth/popup-blocked') {
        throw new Error('팝업이 차단되었습니다. 브라우저의 팝업 차단을 해제해주세요.');
      }

      // 팝업 닫힘
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('로그인이 취소되었습니다.');
      }

      throw new Error(getErrorMessage(error.code));
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUserData(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const value = {
    user,
    userData,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

function getErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return '이미 사용 중인 이메일입니다.';
    case 'auth/invalid-email':
      return '유효하지 않은 이메일 주소입니다.';
    case 'auth/operation-not-allowed':
      return '이메일/비밀번호 로그인이 비활성화되었습니다.';
    case 'auth/weak-password':
      return '비밀번호는 6자 이상이어야 합니다.';
    case 'auth/user-disabled':
      return '비활성화된 계정입니다.';
    case 'auth/user-not-found':
      return '존재하지 않는 계정입니다.';
    case 'auth/wrong-password':
      return '잘못된 비밀번호입니다.';
    default:
      return '인증 오류가 발생했습니다.';
  }
}
