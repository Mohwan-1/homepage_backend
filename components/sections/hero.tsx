import Link from 'next/link';

export default function Hero() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          신뢰할 수 있는 비즈니스 솔루션
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          15년 경험의 검증된 방법론으로 1000개 이상의 기업과 함께 성장해온 파트너입니다.
          안정적인 서비스와 전문적인 지원을 제공합니다.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/products"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-4 rounded-lg transition-colors shadow-sm"
          >
            상품 살펴보기
          </Link>
          <Link
            href="/contact"
            className="bg-white hover:bg-gray-50 text-gray-900 font-medium px-8 py-4 rounded-lg border border-gray-300 transition-colors"
          >
            무료 상담 받기
          </Link>
        </div>
      </div>
    </section>
  );
}