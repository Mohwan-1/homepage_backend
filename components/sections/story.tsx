export default function Story() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              신뢰를 바탕으로 한 15년의 여정
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              2019년 설립 이후, 저희는 고객의 비즈니스 성공을 최우선으로 생각하며
              실용적이고 검증된 솔루션을 제공해왔습니다.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              업계 표준을 준수하는 엔터프라이즈급 서비스로 1000개 이상의 기업과 함께
              성장하며, 99.9%의 안정적인 가동률을 유지하고 있습니다.
            </p>
            <p className="text-lg text-gray-600">
              50명 이상의 전문 인력이 24시간 고객 지원 체계를 운영하며,
              고객의 성공이 곧 저희의 성공이라는 신념으로 서비스를 제공합니다.
            </p>
          </div>
          <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
            <span className="text-gray-500 text-lg">회사 이미지 영역</span>
          </div>
        </div>
      </div>
    </section>
  );
}