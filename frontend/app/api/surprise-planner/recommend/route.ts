import { NextResponse } from 'next/server';
import { generateAIMessage } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      occasion = 'Birthday Surprise',
      relationship = 'Partner',
      recipient = 'Someone Special',
      budget = 2199,
      cakeRequirement = true,
      flowersRequirement = true,
      chocolateRequirement = true,
      decorationRequirement = false,
      personalizedMessage = '',
      additionalNotes = '',
    } = body;

    // Determine package tier recommendation based on budget
    let recommendedPackageTier: 'mini' | 'signature' | 'grand' = 'signature';
    let estimatedTotal = 2199;

    if (budget < 1800) {
      recommendedPackageTier = 'mini';
      estimatedTotal = Math.min(1499, budget);
    } else if (budget >= 2800) {
      recommendedPackageTier = 'grand';
      estimatedTotal = Math.min(2999, Math.max(2800, budget));
    } else {
      recommendedPackageTier = 'signature';
      estimatedTotal = Math.min(2199, budget);
    }

    // Generate personalized card message if not provided
    const cardMessage = personalizedMessage || (await generateAIMessage(recipient, occasion, relationship));

    const personalizedReasoning = `Based on your request for a ${occasion} for your ${relationship} (${recipient}), Bloomora recommends the ${recommendedPackageTier.toUpperCase()} Celebration package. It combines fresh handcrafted floral arrangements with artisanal sweets and personalized keepsake packaging tailored to your ₹${budget} budget.`;

    const suggestedSetup = decorationRequirement
      ? 'White Glove Ambient Decor Setup: Room balloon arrangement, scented candle placement, and satin presentation table.'
      : 'Bloomora Express Delivery: Delivered in signature obsidian and gold keepsake box with handwritten card.';

    return NextResponse.json({
      success: true,
      data: {
        recommendedPackageTier,
        personalizedReasoning,
        generatedCardMessage: cardMessage,
        suggestedSetup,
        estimatedTotal,
      },
    });
  } catch (error) {
    console.error('Surprise Planner API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process surprise recommendations' },
      { status: 500 }
    );
  }
}
