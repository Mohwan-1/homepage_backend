'use client';

import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onSuccess: (userData: { email: string; name: string }) => void;
  onSwitchToSignup: () => void;
}

export default function LoginForm({ onSuccess, onSwitchToSignup }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // TODO: Firebase 로그인 연동
      // const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // 임시 데모 로직
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (email && password) {
        // 관리자 계정 체크
        let userData;
        if (email === 'admin@vibe.com' && password === 'admin123') {
          userData = {
            email,
            name: '관리자',
            role: 'admin'
          };
        } else {
          userData = {
            email,
            name: '사용자',
            role: 'user'
          };
        }

        // localStorage에 저장 (관리자 페이지 접근용)
        localStorage.setItem('userData', JSON.stringify(userData));

        onSuccess(userData);
      } else {
        throw new Error('이메일과 비밀번호를 입력해주세요.');
      }
    } catch (err: any) {
      setError(err.message || '로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Demo Account Info */}
      <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-sm">
        <p className="font-medium mb-1">테스트 계정</p>
        <p className="text-xs">관리자: admin@vibe.com / admin123</p>
        <p className="text-xs">일반: any@email.com / any password</p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          이메일
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="email@example.com"
            required
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          비밀번호
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* Forgot Password */}
      <div className="flex items-center justify-end">
        <button
          type="button"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          비밀번호를 잊으셨나요?
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? '로그인 중...' : '로그인'}
      </button>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">소셜 로그인</span>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div className="space-y-3">
        {/* Google Login */}
        <button
          type="button"
          onClick={() => alert('Google 로그인은 Firebase 연동 후 사용 가능합니다.')}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="font-medium text-gray-700">Google로 로그인</span>
        </button>

        {/* Kakao Login */}
        <button
          type="button"
          onClick={() => alert('Kakao 로그인은 Firebase 연동 후 사용 가능합니다.')}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg transition-colors"
          style={{ backgroundColor: '#FEE500' }}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3C6.477 3 2 6.477 2 10.833c0 2.877 1.953 5.395 4.881 6.812-.203.737-.663 2.446-.756 2.84-.11.467.172.461.362.335.155-.103 2.465-1.641 3.496-2.331.645.088 1.303.133 1.974.133 5.523 0 10-3.477 10-7.79C22 6.478 17.523 3 12 3z"
              fill="#3C1E1E"
            />
          </svg>
          <span className="font-medium" style={{ color: '#3C1E1E' }}>Kakao로 로그인</span>
        </button>
      </div>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">또는</span>
        </div>
      </div>

      {/* Switch to Signup */}
      <div className="text-center">
        <span className="text-gray-600">계정이 없으신가요? </span>
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          회원가입
        </button>
      </div>
    </form>
  );
}