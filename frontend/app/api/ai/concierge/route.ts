import { NextResponse } from 'next/server';
import { generateAIGiftRecommendations } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await generateAIGiftRecommendations(body);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'AI Recommendation failed' }, { status: 500 });
  }
}
