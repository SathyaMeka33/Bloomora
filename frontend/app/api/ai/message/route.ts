import { NextResponse } from 'next/server';
import { generateAIMessage } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { recipient, occasion, relationship } = body;
    const message = await generateAIMessage(recipient, occasion, relationship);
    return NextResponse.json({ success: true, message });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Message generation failed' }, { status: 500 });
  }
}
