import Link from 'next/link';

export default function AuthButtons() {
  return (
    <div className="flex items-center space-x-4">
      <Link
        href="/login"
        className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
      >
        로그인
      </Link>
      <Link
        href="/signup"
        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-gray-900 font-medium px-4 py-2 rounded-lg transition-all shadow-sm"
      >
        회원가입
      </Link>
    </div>
  );
}