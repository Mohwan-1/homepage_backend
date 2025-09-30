'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/cart-context';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import PageHeader from '@/components/layout/page-header';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  category: string;
  popular?: boolean;
}

export default function Products() {
  const router = useRouter();
  const { addItem } = useCart();
  const [activeCategory, setActiveCategory] = useState('전체');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const categories = ['전체', '기본형', '프리미엄', '엔터프라이즈'];

  const products: Product[] = [
    {
      id: '1',
      name: '기본 패키지',
      description: '소규모 비즈니스를 위한 실용적인 솔루션',
      price: 50000,
      features: ['기본 기능', '월 100건 처리', '이메일 지원', '99% 가동률'],
      category: '기본형',
    },
    {
      id: '2',
      name: '비즈니스 패키지',
      description: '중소기업을 위한 검증된 솔루션',
      price: 150000,
      features: ['전체 기능', '월 500건 처리', '24시간 지원', '99.5% 가동률'],
      category: '프리미엄',
      popular: true,
    },
    {
      id: '3',
      name: '엔터프라이즈 패키지',
      description: '대기업을 위한 엔터프라이즈급 솔루션',
      price: 500000,
      features: ['무제한 기능', '무제한 처리', '전담 지원팀', '99.9% 가동률'],
      category: '엔터프라이즈',
    },
  ];

  const featureComparison = [
    { feature: '기본 기능', basic: true, premium: true, enterprise: true },
    { feature: '고급 분석', basic: false, premium: true, enterprise: true },
    { feature: '24시간 지원', basic: false, premium: true, enterprise: true },
    { feature: '전담 매니저', basic: false, premium: false, enterprise: true },
    { feature: '맞춤 개발', basic: false, premium: false, enterprise: true },
  ];

  const faqs = [
    {
      question: '패키지 변경이 가능한가요?',
      answer: '네, 언제든지 패키지를 업그레이드하거나 다운그레이드할 수 있습니다. 변경 사항은 다음 결제일부터 적용됩니다.',
    },
    {
      question: '환불 정책은 어떻게 되나요?',
      answer: '서비스 시작 후 7일 이내에는 100% 환불이 가능합니다. 자세한 사항은 약관을 참조해주세요.',
    },
    {
      question: '데이터 보안은 어떻게 관리되나요?',
      answer: '업계 표준 암호화 방식을 사용하며, ISO 27001 인증을 보유하고 있습니다. 정기적인 보안 감사를 실시합니다.',
    },
    {
      question: '기술 지원은 어떻게 받나요?',
      answer: '이메일, 전화, 채팅을 통해 지원을 받으실 수 있습니다. 프리미엄 이상 패키지는 24시간 지원이 제공됩니다.',
    },
  ];

  const filteredProducts =
    activeCategory === '전체'
      ? products
      : products.filter((p) => p.category === activeCategory);

  const handleSelectProduct = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
    });
    router.push('/checkout');
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <PageHeader
          title="상품 소개"
          subtitle="비즈니스에 맞는 검증된 솔루션을 선택하세요"
          breadcrumb={[
            { name: '홈', href: '/' },
            { name: '상품', href: '/products' },
          ]}
        />

        {/* 카테고리 탭 */}
        <section className="py-8 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    activeCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 상품 그리드 */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
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
                      {product.price.toLocaleString()}원
                    </span>
                    <span className="text-gray-600">/월</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-600 mr-2">✓</span>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleSelectProduct(product)}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    선택하기
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 기능 비교표 */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              기능 비교
            </h2>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left font-bold text-gray-900">
                      기능
                    </th>
                    <th className="px-6 py-4 text-center font-bold text-gray-900">
                      기본형
                    </th>
                    <th className="px-6 py-4 text-center font-bold text-gray-900">
                      프리미엄
                    </th>
                    <th className="px-6 py-4 text-center font-bold text-gray-900">
                      엔터프라이즈
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {featureComparison.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 last:border-0"
                    >
                      <td className="px-6 py-4 text-gray-900">{item.feature}</td>
                      <td className="px-6 py-4 text-center">
                        {item.basic ? (
                          <span className="text-blue-600">✓</span>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {item.premium ? (
                          <span className="text-blue-600">✓</span>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {item.enterprise ? (
                          <span className="text-blue-600">✓</span>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 lg:py-24">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              자주 묻는 질문
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-4 text-left font-medium text-gray-900 hover:bg-gray-50 transition-colors flex justify-between items-center"
                  >
                    <span>{faq.question}</span>
                    <span className="text-blue-600">
                      {openFaq === index ? '−' : '+'}
                    </span>
                  </button>
                  {openFaq === index && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
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