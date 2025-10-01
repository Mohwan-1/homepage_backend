'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { XCircle } from 'lucide-react';

function PaymentFailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const errorCode = searchParams.get('code');
  const errorMessage = searchParams.get('message');
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white border border-red-200 rounded-lg shadow-sm p-8 max-w-md w-full text-center">
        <XCircle size={64} className="text-red-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">결제 실패</h1>
        <p className="text-gray-600 mb-4">
          {errorMessage || '결제 처리 중 오류가 발생했습니다.'}
        </p>

        {errorCode && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">
              <span className="font-medium">오류 코드:</span> {errorCode}
            </p>
            {orderId && (
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">주문 번호:</span> {orderId}
              </p>
            )}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => router.push('/checkout')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            다시 시도하기
          </button>
          <button
            onClick={() => router.push('/products')}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            상품 페이지로 돌아가기
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          문제가 계속되면 고객센터로 문의해주세요.
        </p>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <PaymentFailContent />
    </Suspense>
  );
}
