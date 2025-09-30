import Link from 'next/link';

export default function Offer() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            지금 시작하세요
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            30일 무료 체험으로 모든 기능을 경험해보세요.
            신용카드 등록 없이 바로 시작할 수 있습니다.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-4 rounded-lg transition-colors shadow-sm"
            >
              무료로 시작하기
            </Link>
            <Link
              href="/contact"
              className="bg-white hover:bg-gray-50 text-gray-900 font-medium px-8 py-4 rounded-lg border border-gray-300 transition-colors"
            >
              영업팀에 문의하기
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            문의: contact@company.com | 전화: 02-1234-5678
          </p>
        </div>
      </div>
    </section>
  );
}