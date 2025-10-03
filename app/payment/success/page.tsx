'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/auth-context';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [waitingForUser, setWaitingForUser] = useState(false);

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

      // user가 로드될 때까지 대기
      if (!user) {
        console.log('⏳ 사용자 정보 로딩 대기 중...');
        setWaitingForUser(true);
        return;
      }

      setWaitingForUser(false);
      console.log('✅ 사용자 정보 로드 완료:', user.email);

      try {
        console.log('🔄 결제 승인 처리 시작:', { paymentKey, orderId, amount });

        // 로컬스토리지에서 주문 정보 가져오기
        const orderDataStr = localStorage.getItem(`order_${orderId}`);
        if (!orderDataStr) {
          throw new Error('주문 정보를 찾을 수 없습니다.');
        }

        const orderData = JSON.parse(orderDataStr);
        console.log('📦 주문 정보:', orderData);

        // Firebase에 주문 정보 저장
        const orderRef = await addDoc(collection(db, 'orders'), {
          orderId: orderId,
          userId: user.uid,
          userEmail: user.email,
          userName: orderData.orderInfo?.name || user.displayName || '고객',
          userPhone: orderData.orderInfo?.phone || '',

          // 배송 정보
          shippingAddress: orderData.orderInfo?.address || '',
          shippingDetailAddress: orderData.orderInfo?.detailAddress || '',
          shippingZipCode: orderData.orderInfo?.zipCode || '',

          // 주문 상품
          items: orderData.items || [],
          totalAmount: parseInt(amount),

          // 결제 정보
          paymentMethod: orderData.orderInfo?.paymentMethod || 'card',
          paymentKey: paymentKey,
          paymentStatus: 'paid',

          // 주문 상태
          status: 'paid',

          // 타임스탬프
          createdAt: serverTimestamp(),
          paidAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        console.log('✅ Firebase에 주문 저장 완료:', orderRef.id);

        // 로컬스토리지 업데이트
        orderData.status = 'paid';
        orderData.paymentKey = paymentKey;
        orderData.paidAt = new Date().toISOString();
        orderData.firebaseId = orderRef.id;
        localStorage.setItem(`order_${orderId}`, JSON.stringify(orderData));

        // 장바구니 비우기
        localStorage.removeItem('cart');

        setIsProcessing(false);

        // 3초 후 마이페이지로 이동
        setTimeout(() => {
          router.push('/mypage');
        }, 3000);
      } catch (err: any) {
        console.error('❌ Payment confirmation failed:', err);
        setError(err.message || '결제 승인에 실패했습니다.');
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [searchParams, router, user]);

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
        {isProcessing || waitingForUser ? (
          <>
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">결제 처리 중</h1>
            <p className="text-gray-600">
              {waitingForUser ? '사용자 정보를 확인하는 중입니다...' : '결제를 완료하는 중입니다. 잠시만 기다려주세요.'}
            </p>
          </>
        ) : (
          <>
            <CheckCircle size={64} className="text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">결제 완료</h1>
            <p className="text-gray-600 mb-4">결제가 성공적으로 완료되었습니다.</p>
            <p className="text-sm text-gray-500">주문 내역은 마이페이지에서 확인하실 수 있습니다.</p>
            <p className="text-sm text-gray-500 mt-2">마이페이지로 이동합니다...</p>
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
