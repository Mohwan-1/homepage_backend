export default function Hook() {
  return (
    <section className="bg-blue-600 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
          비즈니스 성장을 위한 검증된 솔루션
        </h2>
        <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
          1000개 이상의 기업이 선택한 이유가 있습니다.
          안정적인 운영과 지속적인 성장을 경험하세요.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">99.9%</div>
            <div className="text-blue-100">서비스 가동률</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">24시간</div>
            <div className="text-blue-100">기술 지원</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">15년</div>
            <div className="text-blue-100">업계 경험</div>
          </div>
        </div>
      </div>
    </section>
  );
}