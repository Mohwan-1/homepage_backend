import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-800 border border-slate-700 rounded p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            신뢰할 수 있는 파트너가 되겠습니다
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            검증된 방법으로 귀사의 비즈니스 성장을 지원합니다
          </p>
          <Link
            href="/contact"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded transition-colors duration-200"
          >
            문의하기
          </Link>
        </div>
      </div>
    </section>
  );
}