import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import PageHeader from '@/components/layout/page-header';

export const metadata = {
  title: '회사소개 | Company',
  description: '신뢰할 수 있는 비즈니스 파트너, 15년 경험의 검증된 솔루션 제공 기업입니다.',
};

export default function About() {
  const coreValues = [
    {
      title: '신뢰성',
      description: '15년간 1000+ 고객사와 함께한 검증된 실적으로 신뢰를 구축합니다',
    },
    {
      title: '전문성',
      description: '업계 표준을 준수하는 엔터프라이즈급 전문 솔루션을 제공합니다',
    },
    {
      title: '안정성',
      description: '99.9% 가동률을 목표로 24시간 안정적인 서비스를 운영합니다',
    },
    {
      title: '실용성',
      description: '실제 비즈니스 현장에서 검증된 실용적인 방법론을 적용합니다',
    },
  ];

  const milestones = [
    { year: '2019', event: '회사 설립' },
    { year: '2020', event: '첫 번째 엔터프라이즈 고객사 확보' },
    { year: '2021', event: '직원 50명 돌파' },
    { year: '2022', event: '누적 고객사 500개 달성' },
    { year: '2023', event: '연매출 100억원 달성' },
    { year: '2024', event: '누적 고객사 1000개 돌파' },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <PageHeader
          title="회사소개"
          subtitle="신뢰할 수 있는 비즈니스 파트너"
          breadcrumb={[
            { name: '홈', href: '/' },
            { name: '회사소개', href: '/about' },
          ]}
        />

        {/* 회사 개요 */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  검증된 경험과 전문성
                </h2>
                <p className="text-gray-600 mb-4">
                  2019년 설립 이후, 1000개 이상의 고객사와 함께 성장해온 신뢰할 수 있는 비즈니스 솔루션 제공 기업입니다.
                </p>
                <p className="text-gray-600 mb-4">
                  50명 이상의 전문 인력이 24시간 고객 지원 체계를 운영하며, 99.9% 가동률을 유지하고 있습니다.
                </p>
                <div className="grid grid-cols-3 gap-6 mt-8">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">2019</div>
                    <div className="text-sm text-gray-600">설립연도</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600">50+</div>
                    <div className="text-sm text-gray-600">직원수</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600">1000+</div>
                    <div className="text-sm text-gray-600">고객사</div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">회사 이미지</span>
              </div>
            </div>
          </div>
        </section>

        {/* 미션 & 비전 */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">미션</h3>
                <p className="text-gray-600">
                  고객의 비즈니스 성장을 위한 실용적인 솔루션을 제공하여 지속 가능한 가치를 창출합니다.
                  업계 표준을 준수하며 신뢰할 수 있는 서비스로 고객과 함께 성장합니다.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">비전</h3>
                <p className="text-gray-600">
                  업계 표준을 선도하는 엔터프라이즈급 서비스 제공 기업으로 성장하여,
                  고객과 함께 지속 가능한 비즈니스 생태계를 구축합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 핵심 가치 */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              핵심 가치
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {coreValues.map((value, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-blue-600 font-bold text-xl">{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 연혁 */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              연혁
            </h2>
            <div className="max-w-3xl mx-auto">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-6 mb-8 last:mb-0">
                  <div className="flex-shrink-0">
                    <div className="w-20 text-right">
                      <span className="text-lg font-bold text-blue-600">
                        {milestone.year}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 relative">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mt-2"></div>
                    {index < milestones.length - 1 && (
                      <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-0.5 h-12 bg-gray-300"></div>
                    )}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-gray-900 font-medium">{milestone.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}