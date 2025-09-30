interface Feature {
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    title: '검증된 방법',
    description: '15년 경험을 바탕으로 1000+ 고객사가 신뢰하는 실용적인 솔루션을 제공합니다',
  },
  {
    title: '24시간 지원',
    description: '99.9% 가동률을 자랑하는 안정적인 서비스와 신속한 고객 지원을 약속합니다',
  },
  {
    title: '맞춤형 솔루션',
    description: '업계 표준에 부합하는 엔터프라이즈급 비즈니스 솔루션을 맞춤 제공합니다',
  },
];

export default function Features() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-800 border border-slate-700 p-6 rounded"
            >
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}