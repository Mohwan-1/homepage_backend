import { CheckCircle, Clock, Shield } from 'lucide-react';

export default function Benefits() {
  const benefits = [
    {
      icon: CheckCircle,
      title: '무료 초기 상담',
      description: '비즈니스 분석 및 맞춤형 솔루션 제안을 무료로 제공합니다',
    },
    {
      icon: Clock,
      title: '30일 무료 체험',
      description: '모든 기능을 30일간 무료로 사용해보고 결정하실 수 있습니다',
    },
    {
      icon: Shield,
      title: '평생 기술 지원',
      description: '서비스 이용 기간 동안 무제한 기술 지원을 제공합니다',
    },
  ];

  return (
    <section className="bg-gray-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            제공하는 무료 혜택
          </h2>
          <p className="text-lg text-gray-600">
            고객의 성공을 위해 실질적인 지원을 제공합니다
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}