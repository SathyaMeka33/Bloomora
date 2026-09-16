import { NextResponse } from 'next/server';
import { saveSurprisePlannerRequest } from '@/lib/services/surpriseService';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      occasion = 'Birthday Surprise',
      recipientName,
      relationship,
      eventDate,
      preferredTime = 'Evening (6 PM - 9 PM)',
      city,
      locationDetails,
      typeOfSurprise = 'Custom Celebration',
      numberOfPeople = 1,
      budget = 3000,
      requiredItems = [],
      notes = '',
    } = body;

    if (!customerName || !customerPhone || !recipientName || !eventDate || !city || !locationDetails) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please fill in all required fields including customer contact, recipient, event date, city, and location details.',
        },
        { status: 400 }
      );
    }

    // Check 3-day lead time notice rule
    const selectedDate = new Date(eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = selectedDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const isUrgent = diffDays < 3;

    const requestId = await saveSurprisePlannerRequest({
      customerName,
      customerEmail: customerEmail || 'guest@bloomora.com',
      customerPhone,
      occasion,
      recipientName,
      relationship: relationship || 'Loved One',
      eventDate,
      preferredTime,
      city,
      locationDetails,
      typeOfSurprise,
      numberOfPeople: Number(numberOfPeople) || 1,
      budget: Number(budget) || 3000,
      requiredItems: Array.isArray(requiredItems) ? requiredItems : [],
      notes,
    });

    return NextResponse.json({
      success: true,
      requestId,
      isUrgent,
      message: 'Your request has been sent to the Bloomora team. Our team will contact you to discuss availability, arrangements and final pricing.',
    });
  } catch (error) {
    console.error('Failed to process surprise planner request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit surprise planner request' },
      { status: 500 }
    );
  }
}
