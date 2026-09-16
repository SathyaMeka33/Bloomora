import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminDb } from '@/lib/firebase/admin';

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.warn('Razorpay webhook secret (RAZORPAY_WEBHOOK_SECRET) is unconfigured.');
    return NextResponse.json(
      {
        success: false,
        error: 'Razorpay webhook processing is unconfigured on server (missing RAZORPAY_WEBHOOK_SECRET).',
        isSimulated: true,
      },
      { status: 503 }
    );
  }

  try {
    const rawBody = await req.text();
    const razorpaySignature = req.headers.get('x-razorpay-signature');

    if (!razorpaySignature) {
      return NextResponse.json({ success: false, error: 'Missing Razorpay signature header' }, { status: 400 });
    }

    // Verify HMAC SHA256 signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      console.error('Razorpay webhook signature verification failed.');
      return NextResponse.json({ success: false, error: 'Invalid webhook signature' }, { status: 400 });
    }

    const eventPayload = JSON.parse(rawBody);
    const eventId = eventPayload.event_id || req.headers.get('x-razorpay-event-id');
    const eventType = eventPayload.event;

    console.log(`Processing Razorpay webhook event: ${eventType} (Event ID: ${eventId || 'N/A'})`);

    // Enforce idempotency if adminDb is available
    if (adminDb && eventId) {
      const webhookRef = adminDb.collection('processedWebhooks').doc(eventId);
      const webhookSnap = await webhookRef.get();
      if (webhookSnap.exists) {
        console.log(`Duplicate webhook event skipped: ${eventId}`);
        return NextResponse.json({ success: true, message: 'Event already processed' });
      }
      await webhookRef.set({
        eventId,
        eventType,
        processedAt: new Date().toISOString(),
      });
    }

    const payloadEntity = eventPayload.payload?.payment?.entity || eventPayload.payload?.refund?.entity;
    const razorpayOrderId = payloadEntity?.order_id;
    const paymentId = payloadEntity?.id;

    if (adminDb && razorpayOrderId) {
      // Find matching order in Firestore
      const ordersSnap = await adminDb
        .collection('orders')
        .where('razorpayOrderId', '==', razorpayOrderId)
        .limit(1)
        .get();

      if (!ordersSnap.empty) {
        const orderDoc = ordersSnap.docs[0];
        const orderRef = orderDoc.ref;

        if (eventType === 'payment.captured') {
          await orderRef.update({
            paymentStatus: 'paid',
            paymentId: paymentId || orderDoc.data().paymentId,
            status: 'CONFIRMED',
            updatedAt: new Date().toISOString(),
          });
          console.log(`Order ${orderDoc.id} payment status updated to paid & CONFIRMED`);
        } else if (eventType === 'payment.failed') {
          await orderRef.update({
            paymentStatus: 'failed',
            status: 'CANCELLED',
            updatedAt: new Date().toISOString(),
          });
          console.log(`Order ${orderDoc.id} payment status updated to failed`);
        } else if (eventType === 'refund.processed') {
          await orderRef.update({
            paymentStatus: 'refunded',
            updatedAt: new Date().toISOString(),
          });
          console.log(`Order ${orderDoc.id} payment status updated to refunded`);
        }
      } else {
        console.warn(`No order found in Firestore for Razorpay Order ID: ${razorpayOrderId}`);
      }
    }

    return NextResponse.json({ success: true, event: eventType });
  } catch (error: any) {
    console.error('Razorpay webhook execution error:', error.message || error);
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed', details: error.message },
      { status: 500 }
    );
  }
}
