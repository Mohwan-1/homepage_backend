import Link from 'next/link';

export default function ProductsHome() {
  const products = [
    {
      name: '기본 패키지',
      description: '소규모 비즈니스를 위한 실용적인 솔루션',
      price: '50,000',
      features: ['기본 기능', '월 100건 처리', '이메일 지원', '99% 가동률'],
    },
    {
      name: '비즈니스 패키지',
      description: '중소기업을 위한 검증된 솔루션',
      price: '150,000',
      features: ['전체 기능', '월 500건 처리', '24시간 지원', '99.5% 가동률'],
      popular: true,
    },
    {
      name: '엔터프라이즈 패키지',
      description: '대기업을 위한 엔터프라이즈급 솔루션',
      price: '500,000',
      features: ['무제한 기능', '무제한 처리', '전담 지원팀', '99.9% 가동률'],
    },
  ];

  return (
    <section className="bg-gray-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            비즈니스에 맞는 솔루션
          </h2>
          <p className="text-lg text-gray-600">
            규모와 요구사항에 맞는 최적의 패키지를 선택하세요
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow relative"
            >
              {product.popular && (
                <div className="absolute top-4 right-4 bg-blue-600 text-white text-sm px-3 py-1 rounded">
                  인기
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {product.name}
              </h3>
              <p className="text-gray-600 mb-6">{product.description}</p>
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  {product.price}원
                </span>
                <span className="text-gray-600">/월</span>
              </div>
              <ul className="space-y-3 mb-8">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/products"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                자세히 보기
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}