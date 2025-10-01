'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/cart-context';
import { CreditCard, Wallet, Building, ShoppingBag, MapPin, User as UserIcon, Phone, Mail, ArrowLeft, Home } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalAmount, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const [orderInfo, setOrderInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    detailAddress: '',
    zipCode: '',
    paymentMethod: 'card' as 'card' | 'transfer' | 'toss',
  });

  useEffect(() => {
    // 로그인 사용자 정보 불러오기
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      setOrderInfo(prev => ({
        ...prev,
        name: userData.name || '',
        email: userData.email || '',
      }));
    }
  }, []);

  useEffect(() => {
    // 장바구니가 비어있으면 상품 페이지로 리다이렉트
    if (items.length === 0) {
      alert('장바구니가 비어있습니다.');
      router.push('/products');
    }
  }, [items, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrderInfo({
      ...orderInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handlePayment = async () => {
    // 입력값 검증
    if (!orderInfo.name || !orderInfo.phone || !orderInfo.address) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const orderName = items[0].name + (items.length > 1 ? ` 외 ${items.length - 1}건` : '');

      // 주문 정보 저장 (결제 전)
      const orderData = {
        orderId,
        items,
        totalAmount,
        orderInfo,
        orderDate: new Date().toISOString(),
        status: 'pending',
      };
      localStorage.setItem(`order_${orderId}`, JSON.stringify(orderData));

      // TossPayments 결제 요청
      if (orderInfo.paymentMethod === 'card' || orderInfo.paymentMethod === 'toss') {
        const { requestPayment } = await import('@/lib/toss-payments');

        await requestPayment({
          amount: totalAmount,
          orderId,
          orderName,
          customerName: orderInfo.name,
          customerEmail: orderInfo.email,
          customerMobilePhone: orderInfo.phone,
        });
      } else if (orderInfo.paymentMethod === 'transfer') {
        // 무통장 입금 처리
        alert('무통장 입금 정보가 이메일로 발송됩니다.');

        // 주문 상태 업데이트
        orderData.status = 'pending_transfer';
        localStorage.setItem(`order_${orderId}`, JSON.stringify(orderData));

        // 장바구니 비우기
        clearCart();

        // 주문 완료 페이지로 이동
        router.push(`/order-complete?orderId=${orderId}`);
      }
    } catch (error) {
      console.error('Payment failed:', error);
      alert('결제에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Buttons */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>뒤로가기</span>
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Home size={20} />
            <span>홈으로</span>
          </button>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">주문/결제</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Order Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <UserIcon size={20} />
                주문자 정보
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                  <input
                    type="text"
                    name="name"
                    value={orderInfo.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                  <input
                    type="email"
                    name="email"
                    value={orderInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
                  <input
                    type="tel"
                    name="phone"
                    value={orderInfo.phone}
                    onChange={handleInputChange}
                    placeholder="010-1234-5678"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin size={20} />
                배송지 정보
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">우편번호</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="zipCode"
                      value={orderInfo.zipCode}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                      우편번호 찾기
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">주소</label>
                  <input
                    type="text"
                    name="address"
                    value={orderInfo.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">상세주소</label>
                  <input
                    type="text"
                    name="detailAddress"
                    value={orderInfo.detailAddress}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CreditCard size={20} />
                결제 방법
              </h2>
              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={orderInfo.paymentMethod === 'card'}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <CreditCard size={20} className="mr-2 text-gray-600" />
                  <span className="font-medium">신용카드</span>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="toss"
                    checked={orderInfo.paymentMethod === 'toss'}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <Wallet size={20} className="mr-2 text-gray-600" />
                  <span className="font-medium">토스페이</span>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="transfer"
                    checked={orderInfo.paymentMethod === 'transfer'}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <Building size={20} className="mr-2 text-gray-600" />
                  <span className="font-medium">무통장입금</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ShoppingBag size={20} />
                주문 상품
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">수량: {item.quantity}개</p>
                    </div>
                    <p className="font-medium text-gray-800">
                      ₩{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>상품 금액</span>
                  <span>₩{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>배송비</span>
                  <span>무료</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t border-gray-200">
                  <span>총 결제금액</span>
                  <span className="text-blue-600">₩{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '결제 처리 중...' : `₩${totalAmount.toLocaleString()} 결제하기`}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                주문 진행 시 이용약관 및 개인정보처리방침에 동의하는 것으로 간주됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}