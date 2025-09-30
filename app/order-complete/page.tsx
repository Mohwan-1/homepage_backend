'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Home, ShoppingBag } from 'lucide-react';

function OrderCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    if (!orderId) {
      alert('잘못된 접근입니다.');
      router.push('/');
      return;
    }

    const savedOrder = localStorage.getItem(`order_${orderId}`);
    if (savedOrder) {
      setOrderData(JSON.parse(savedOrder));
    } else {
      alert('주문 정보를 찾을 수 없습니다.');
      router.push('/');
    }
  }, [orderId, router]);

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 py-16">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle size={48} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">주문이 완료되었습니다!</h1>
          <p className="text-gray-600">주문해 주셔서 감사합니다.</p>
        </div>

        {/* Order Info Card */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 mb-6">
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">주문번호</span>
              <span className="font-mono font-medium text-gray-800">{orderData.orderId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">주문일시</span>
              <span className="text-gray-800">{new Date(orderData.orderDate).toLocaleString('ko-KR')}</span>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Package size={20} />
              주문 상품
            </h2>
            <div className="space-y-3">
              {orderData.items.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">수량: {item.quantity}개</p>
                  </div>
                  <p className="font-medium text-gray-800">
                    ₩{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Info */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4">배송 정보</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-start">
                <span className="text-gray-600 w-24">받는 사람</span>
                <span className="text-gray-800">{orderData.orderInfo.name}</span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-600 w-24">전화번호</span>
                <span className="text-gray-800">{orderData.orderInfo.phone}</span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-600 w-24">주소</span>
                <span className="text-gray-800">
                  ({orderData.orderInfo.zipCode}) {orderData.orderInfo.address} {orderData.orderInfo.detailAddress}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Amount */}
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-800">총 결제금액</span>
            <span className="text-2xl font-bold text-blue-600">
              ₩{orderData.totalAmount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Info Message */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            주문 확인 및 배송 정보는 이메일과 SMS로 발송됩니다.<br />
            마이페이지에서 주문 상태를 확인하실 수 있습니다.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Home size={20} />
            홈으로
          </Link>
          <Link
            href="/mypage/orders"
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Package size={20} />
            주문내역
          </Link>
          <Link
            href="/products"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ShoppingBag size={20} />
            쇼핑 계속하기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderCompletePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <OrderCompleteContent />
    </Suspense>
  );
}