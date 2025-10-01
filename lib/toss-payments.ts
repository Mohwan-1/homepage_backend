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
    const tossPayments = await loadTossPayments(clientKey);
    return tossPayments;
  } catch (error) {
    console.error('Failed to load TossPayments:', error);
    throw error;
  }
};

export const requestPayment = async (paymentData: PaymentData) => {
  const tossPayments = await initializeTossPayments();

  const payment = tossPayments.payment({
    customerKey: paymentData.customerEmail || 'GUEST_' + Date.now(),
  });

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
};

export const generateOrderId = () => {
  return `ORDER_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};
