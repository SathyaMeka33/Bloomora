import api from "../client";

export const paymentApiService = {
  async createRazorpayOrder(orderId: number) {
    return api.post<{ razorpay_order_id: string; amount: number; razorpay_key_id: string; mock?: boolean }>("/api/payments/create-order/", { order_id: orderId });
  },
  async verifyPayment(data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string; order_id: number }) {
    return api.post<{ success: boolean; order_id: number }>("/api/payments/verify/", data);
  },
};
