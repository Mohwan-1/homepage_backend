'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processPayment = async () => {
      const paymentKey = searchParams.get('paymentKey');
      const orderId = searchParams.get('orderId');
      const amount = searchParams.get('amount');

      if (!paymentKey || !orderId || !amount) {
        setError('결제 정보가 올바르지 않습니다.');
        setIsProcessing(false);
        return;
      }

      try {
        // TODO: 서버에서 결제 승인 처리
        // const response = await fetch('/api/payments/confirm', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ paymentKey, orderId, amount }),
        // });

        // 임시: 로컬스토리지에서 주문 정보 업데이트
        const orderDataStr = localStorage.getItem(`order_${orderId}`);
        if (orderDataStr) {
          const orderData = JSON.parse(orderDataStr);
          orderData.status = 'paid';
          orderData.paymentKey = paymentKey;
          orderData.paidAt = new Date().toISOString();
          localStorage.setItem(`order_${orderId}`, JSON.stringify(orderData));
        }

        // 장바구니 비우기
        localStorage.removeItem('cart');

        setIsProcessing(false);

        // 2초 후 홈으로 이동
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } catch (err) {
        console.error('Payment confirmation failed:', err);
        setError('결제 승인에 실패했습니다.');
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white border border-red-200 rounded-lg shadow-sm p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-3xl">✕</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">결제 실패</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/products')}
            className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            상품 페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 max-w-md w-full text-center">
        {isProcessing ? (
          <>
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">결제 처리 중</h1>
            <p className="text-gray-600">결제를 완료하는 중입니다. 잠시만 기다려주세요.</p>
          </>
        ) : (
          <>
            <CheckCircle size={64} className="text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">결제 완료</h1>
            <p className="text-gray-600 mb-4">결제가 성공적으로 완료되었습니다.</p>
            <p className="text-sm text-gray-500">홈으로 이동합니다...</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
