export type NotificationEventType =
  | 'ORDER_CONFIRMATION'
  | 'PAYMENT_CONFIRMATION'
  | 'ORDER_PREPARATION_UPDATE'
  | 'PARTNER_READY_NOTIFICATION'
  | 'DELIVERY_UPDATE'
  | 'MEET_ME_THERE_PICKUP_PIN'
  | 'BIRTHDAY_REMINDER'
  | 'ANNIVERSARY_REMINDER';

export interface NotificationPayload {
  eventType: NotificationEventType;
  recipientEmail?: string;
  recipientPhone?: string;
  recipientName?: string;
  orderId?: string;
  pickupPin?: string;
  statusDetails?: string;
  reminderDate?: string;
  occasionTitle?: string;
  customMessage?: string;
}

export interface NotificationResult {
  success: boolean;
  delivered: boolean;
  provider: 'resend' | 'twilio' | 'console' | 'unconfigured';
  messageId?: string;
  reason?: string;
}

export async function sendNotification(payload: NotificationPayload): Promise<NotificationResult> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_PHONE_NUMBER;

  console.log(`[Notification Service] Triggered event: ${payload.eventType} for ${payload.recipientEmail || payload.recipientPhone || 'Customer'}`);

  // 1. Resend Email Dispatch (if configured)
  if (resendApiKey && payload.recipientEmail) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Bloomora <notifications@bloomora.com>',
          to: [payload.recipientEmail],
          subject: getNotificationSubject(payload),
          html: getNotificationHtml(payload),
        }),
      });

      const resData = await response.json();
      if (response.ok) {
        return {
          success: true,
          delivered: true,
          provider: 'resend',
          messageId: resData.id,
        };
      }
    } catch (err: any) {
      console.warn('[Notification Service] Resend email dispatch failed:', err.message || err);
    }
  }

  // 2. Twilio SMS Dispatch (if configured)
  if (twilioSid && twilioToken && twilioFrom && payload.recipientPhone) {
    try {
      const authHeader = 'Basic ' + Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64');
      const bodyParams = new URLSearchParams({
        To: payload.recipientPhone,
        From: twilioFrom,
        Body: getNotificationText(payload),
      });

      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: bodyParams.toString(),
      });

      const resData = await response.json();
      if (response.ok) {
        return {
          success: true,
          delivered: true,
          provider: 'twilio',
          messageId: resData.sid,
        };
      }
    } catch (err: any) {
      console.warn('[Notification Service] Twilio SMS dispatch failed:', err.message || err);
    }
  }

  // 3. Fallback: Log explicit unconfigured provider status
  console.log(`[Notification Service] External Email/SMS providers are unconfigured. Logged notification payload locally:`, payload);

  return {
    success: true,
    delivered: false,
    provider: 'unconfigured',
    reason: 'External notification providers (RESEND_API_KEY or TWILIO_ACCOUNT_SID) are not configured in environment variables.',
  };
}

function getNotificationSubject(payload: NotificationPayload): string {
  switch (payload.eventType) {
    case 'ORDER_CONFIRMATION':
      return `Bloomora Order Confirmed - #${payload.orderId || ''}`;
    case 'PAYMENT_CONFIRMATION':
      return `Payment Received - Bloomora Order #${payload.orderId || ''}`;
    case 'ORDER_PREPARATION_UPDATE':
      return `Your Bloomora Gift is Being Wrapped - #${payload.orderId || ''}`;
    case 'PARTNER_READY_NOTIFICATION':
      return `Your Order is Ready for Pickup - #${payload.orderId || ''}`;
    case 'DELIVERY_UPDATE':
      return `Delivery Update - Bloomora Order #${payload.orderId || ''}`;
    case 'MEET_ME_THERE_PICKUP_PIN':
      return `Your Meet Me There Locker PIN - #${payload.orderId || ''}`;
    case 'BIRTHDAY_REMINDER':
      return `Bloomora Reminder: Upcoming Birthday for ${payload.recipientName || 'Someone Special'}`;
    case 'ANNIVERSARY_REMINDER':
      return `Bloomora Reminder: Upcoming Anniversary for ${payload.recipientName || 'Someone Special'}`;
    default:
      return `Bloomora Notification`;
  }
}

function getNotificationText(payload: NotificationPayload): string {
  if (payload.eventType === 'MEET_ME_THERE_PICKUP_PIN') {
    return `Bloomora Meet Me There: Your locker pickup PIN for Order #${payload.orderId} is ${payload.pickupPin}. Enjoy your gift!`;
  }
  return `${getNotificationSubject(payload)}. ${payload.customMessage || payload.statusDetails || ''}`;
}

function getNotificationHtml(payload: NotificationPayload): string {
  return `
    <div style="font-family: Arial, sans-serif; color: #262626; padding: 20px;">
      <h2 style="color: #D4AF37;">Bloomora Luxury Gifting</h2>
      <h3>${getNotificationSubject(payload)}</h3>
      <p>Hello ${payload.recipientName || 'Valued Customer'},</p>
      <p>${payload.customMessage || payload.statusDetails || 'Thank you for choosing Bloomora.'}</p>
      ${payload.pickupPin ? `<div style="background: #262626; color: #D4AF37; padding: 15px; font-size: 24px; font-weight: bold; text-align: center; border-radius: 8px;">Pickup PIN: ${payload.pickupPin}</div>` : ''}
      <p style="font-size: 12px; color: #6B6B6B; margin-top: 20px;">Bloomora • Rajahmundry & Beyond</p>
    </div>
  `;
}
