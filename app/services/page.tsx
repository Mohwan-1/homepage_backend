import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

const services = [
  {
    title: '비즈니스 컨설팅',
    description: '업계 표준에 부합하는 전문적인 컨설팅 서비스를 제공합니다',
  },
  {
    title: '시스템 구축',
    description: '엔터프라이즈급 안정성을 보장하는 시스템 구축 서비스입니다',
  },
  {
    title: '운영 지원',
    description: '99.9% 가동률을 목표로 24시간 운영 지원을 제공합니다',
  },
];

export default function Services() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">서비스 소개</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-slate-800 border border-slate-700 rounded p-8"
              >
                <h2 className="text-2xl font-semibold text-white mb-4">
                  {service.title}
                </h2>
                <p className="text-gray-400">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}