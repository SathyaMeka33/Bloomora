import { NextResponse } from 'next/server';
import { generateAIChatResponse } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { history = [], query } = body;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please enter a valid prompt to converse with Bloomora AI.',
        },
        { status: 400 }
      );
    }

    // Limit maximum length to prevent prompt injection or excessive tokens
    const sanitizedQuery = query.trim().slice(0, 1000);
    const sanitizedHistory: { role: 'user' | 'assistant'; content: string }[] = Array.isArray(history)
      ? history.slice(-10).map((msg: any) => ({
          role: (msg.role === 'assistant' ? 'assistant' : 'user') as 'user' | 'assistant',
          content: String(msg.content || '').slice(0, 1000),
        }))
      : [];

    const result = await generateAIChatResponse(sanitizedHistory, sanitizedQuery);

    return NextResponse.json({
      success: true,
      text: result.text,
      action: result.action,
    });
  } catch (error) {
    console.error('Bloomora AI chat route error:', error);
    return NextResponse.json(
      {
        success: false,
        text: 'Bloomora AI is temporarily unavailable. You can continue exploring Bloomora and our gifting collections.',
        action: { label: 'Explore Gift Catalog', href: '/catalog' },
      },
      { status: 200 } // Graceful fallback
    );
  }
}
