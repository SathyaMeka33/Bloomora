import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      // If secret is not provided in env, accept payment in sandbox mode
      return NextResponse.json({ success: true, verified: true, isSimulated: true });
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    if (isValid) {
      return NextResponse.json({ success: true, verified: true });
    } else {
      return NextResponse.json({ success: false, verified: false, error: 'Invalid payment signature' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Razorpay verification error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
