import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { sendNotification } from '@/lib/services/notificationService';

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get('authorization');
  const searchSecret = req.nextUrl.searchParams.get('secret');

  // Secret verification
  if (cronSecret) {
    const isHeaderValid = authHeader === `Bearer ${cronSecret}`;
    const isParamValid = searchSecret === cronSecret;

    if (!isHeaderValid && !isParamValid) {
      return NextResponse.json({ success: false, error: 'Unauthorized cron request. Invalid CRON_SECRET token.' }, { status: 401 });
    }
  }

  if (!adminDb) {
    return NextResponse.json({ success: false, error: 'Firebase Admin DB is unconfigured on server' }, { status: 503 });
  }

  try {
    const today = new Date();
    const targetDate = new Date();
    targetDate.setDate(today.getDate() + 3); // 3 days in advance
    const targetDateString = targetDate.toISOString().split('T')[0]; // YYYY-MM-DD format

    console.log(`[Cron Reminder Service] Checking upcoming occasion reminders for target date: ${targetDateString}`);

    // Query user reminders collection group
    const remindersSnap = await adminDb.collectionGroup('reminders').get();
    const processedReminders: any[] = [];
    const notificationResults: any[] = [];

    for (const docSnap of remindersSnap.docs) {
      const reminderData = docSnap.data();
      const reminderId = docSnap.id;
      const reminderDate = reminderData.date; // e.g. YYYY-MM-DD

      // Check if reminder date matches target 3-day window
      if (reminderDate && reminderDate.endsWith(targetDateString.slice(5))) {
        // Enforce idempotency: Check if reminder was already sent this year
        const currentYear = new Date().getFullYear();
        const sentLogId = `${reminderId}_${currentYear}`;
        const sentRef = adminDb.collection('sentReminders').doc(sentLogId);
        const sentSnap = await sentRef.get();

        if (sentSnap.exists) {
          console.log(`[Cron Reminder Service] Reminder ${reminderId} already dispatched for ${currentYear}. Skipping.`);
          continue;
        }

        // Send notification
        const eventType = reminderData.occasion?.toLowerCase().includes('anniversary')
          ? 'ANNIVERSARY_REMINDER'
          : 'BIRTHDAY_REMINDER';

        const notifResult = await sendNotification({
          eventType,
          recipientName: reminderData.recipientName || 'Dearest One',
          reminderDate,
          occasionTitle: reminderData.title || reminderData.occasion || 'Upcoming Celebration',
          customMessage: `Bloomora Reminder: ${reminderData.recipientName}'s ${reminderData.occasion || 'Special Day'} is in 3 days (${reminderDate}). Curate a gift experience now!`,
        });

        // Record dispatch log in Firestore
        await sentRef.set({
          reminderId,
          userId: reminderData.userId || docSnap.ref.parent.parent?.id,
          recipientName: reminderData.recipientName,
          occasion: reminderData.occasion,
          sentAt: new Date().toISOString(),
          year: currentYear,
          providerStatus: notifResult.provider,
        });

        processedReminders.push({ id: reminderId, recipient: reminderData.recipientName, date: reminderDate });
        notificationResults.push(notifResult);
      }
    }

    return NextResponse.json({
      success: true,
      targetDate: targetDateString,
      remindersProcessedCount: processedReminders.length,
      processedReminders,
      notificationResults,
    });
  } catch (error: any) {
    console.error('[Cron Reminder Service] Execution failed:', error.message || error);
    return NextResponse.json({ success: false, error: error.message || 'Cron execution failed' }, { status: 500 });
  }
}
