import { loadTossPayments } from '@tosspayments/tosspayments-sdk';

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;

export interface PaymentData {
  amount: number;
  orderId: string;
  orderName: string;
  customerName: string;
  customerEmail?: string;
  customerMobilePhone?: string;
}

export const initializeTossPayments = async () => {
  try {
    if (!clientKey) {
      throw new Error('TossPayments Client Key가 설정되지 않았습니다.');
    }
    console.log('TossPayments 초기화 중... Client Key:', clientKey.substring(0, 10) + '...');
    const tossPayments = await loadTossPayments(clientKey);
    console.log('TossPayments 초기화 성공');
    return tossPayments;
  } catch (error) {
    console.error('TossPayments 초기화 실패:', error);
    throw error;
  }
};

export const requestPayment = async (paymentData: PaymentData) => {
  try {
    console.log('결제 요청 시작:', paymentData);
    const tossPayments = await initializeTossPayments();

    const payment = tossPayments.payment({
      customerKey: paymentData.customerEmail || 'GUEST_' + Date.now(),
    });

    console.log('결제 위젯 호출 중...');
    await payment.requestPayment({
      method: 'CARD',
      amount: {
        currency: 'KRW',
        value: paymentData.amount,
      },
      orderId: paymentData.orderId,
      orderName: paymentData.orderName,
      successUrl: `${window.location.origin}/payment/success`,
      failUrl: `${window.location.origin}/payment/fail`,
      customerEmail: paymentData.customerEmail,
      customerName: paymentData.customerName,
      customerMobilePhone: paymentData.customerMobilePhone,
    });
    console.log('결제 위젯 호출 완료');
  } catch (error: any) {
    console.error('결제 요청 실패:', error);
    console.error('에러 코드:', error.code);
    console.error('에러 메시지:', error.message);
    throw error;
  }
};

export const generateOrderId = () => {
  return `ORDER_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};
