import { GoogleGenAI } from '@google/genai';
import { GiftComboRecommendation, PRODUCTS } from './mockData';

export interface AIConciergeInput {
  budget: number;
  occasion: string;
  recipient: string;
  relationship: string;
  city: string;
  deliveryTime: string;
  notes?: string;
  gender?: string;
  ageGroup?: string;
}

const geminiApiKey = process.env.GEMINI_API_KEY || '';
let aiInstance: GoogleGenAI | null = null;

if (geminiApiKey) {
  try {
    aiInstance = new GoogleGenAI({ apiKey: geminiApiKey });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

// 1. AI Local Availability Engine
export function getLocalAvailableItems(city: string) {
  return PRODUCTS.filter((p) => p.inStock);
}

// 2. AI Smart Packaging Suggestions Engine
export function suggestSmartPackaging(budget: number, relationship: string): string {
  if (budget >= 1000) return 'Carved Wooden Box & Satin Organza Ribbon (Keepsake Box)';
  if (budget >= 500) return 'Midnight Black Rigid Cylinder Box with Gold Foil Seal';
  if (budget >= 300) return 'Luxury Ivory Matte Wrap with Gold Velvet Ribbon';
  return 'Soft Blush Paper with Satin Bow (Flat ₹10 Destination Pickup)';
}

// 3. AI Occasion Intelligence Engine
export function getOccasionTagline(occasion: string): string {
  const occ = occasion.toLowerCase();
  if (occ.includes('birthday')) return '🎉 Make their special day light up with joy';
  if (occ.includes('love') || occ.includes('romance') || occ.includes('proposal')) return '❤️ Express everlasting devotion in golden satin';
  if (occ.includes('anniversary')) return '🥂 Celebrate milestone years with everlasting memories';
  if (occ.includes('congratulations') || occ.includes('graduation')) return '🌟 Honor grand achievements and future dreams';
  if (occ.includes('sorry')) return '🌸 Mend hearts with soft roses and sweet chocolates';
  return '✨ A warm gesture tailored with affection';
}

// 4. AI Personalized Message Generator Engine (Live Gemini Integration)
export async function generateAIMessage(
  recipient = 'Someone Special',
  occasion = 'birthday',
  relationship = 'friend'
): Promise<string> {
  if (aiInstance) {
    try {
      const response = await aiInstance.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are an expert handwritten greeting card assistant for a luxury gifting platform called Bloomora.
Write a warm, beautiful, and emotionally touching greeting message (2-3 sentences max) for a gift card.
Recipient: ${recipient}
Occasion: ${occasion}
Relationship: ${relationship}

CRITICAL: Do NOT include any emojis or symbols. Use elegant typography text only. Return ONLY the message text without quotes.`,
      });

      const text = response.text?.trim();
      if (text) return text;
    } catch (error) {
      console.warn('Gemini API call for card message failed, falling back to dynamic generator:', error);
    }
  }

  // Fallback dynamic generator if key is missing or API errors out
  const rel = relationship.toLowerCase();
  const occ = occasion.toLowerCase();

  if (occ.includes('birthday')) {
    if (rel.includes('girlfriend') || rel.includes('wife') || rel.includes('love') || rel.includes('romantic')) {
      return `To my dearest ${recipient}, every moment with you feels like a gift. May your birthday be as beautiful, warm, and shining as your heart. With all my love today and forever.`;
    }
    return `Happy Birthday ${recipient}! Sending you warmest wishes, endless laughter, and beautiful memories on your special day. Stay amazing!`;
  } else if (occ.includes('anniversary') || occ.includes('love')) {
    return `Dearest ${recipient}, celebrating the bond we share and every beautiful memory we have created together. Here is to love, laughter, and many more happy years ahead.`;
  } else if (occ.includes('congratulations') || occ.includes('graduation')) {
    return `Huge congratulations ${recipient}! So proud of your hard work and incredible achievement. The sky is just the beginning for you!`;
  } else if (occ.includes('sorry')) {
    return `Dearest ${recipient}, I value our relationship more than words can express. Please accept this token of love with my sincere heart.`;
  }
  return `To ${recipient}, a sweet gesture filled with warmth, smiles, and heartfelt affection just for you.`;
}

// 5. Complete AI Gifting Suite Orchestrator (Live Gemini API Integration)
export async function generateAIGiftRecommendations(
  input: AIConciergeInput
): Promise<{
  recommendation: GiftComboRecommendation;
  alternativeCombos: GiftComboRecommendation[];
  greetingMessage: string;
  reasoning: string;
  packagingSuggestion: string;
}> {
  const budget = input.budget || 300;
  const occasion = input.occasion.toLowerCase();
  const relationship = input.relationship.toLowerCase();
  const city = input.city || 'Rajahmundry';
  const packaging = suggestSmartPackaging(budget, relationship);
  const cardMessage = await generateAIMessage(input.recipient, occasion, relationship);

  if (aiInstance) {
    try {
      const prompt = `You are Bloomora's AI Gift Concierge.
The customer wants a gift package recommendation based on these parameters:
- Budget: ₹${budget}
- Occasion: ${input.occasion}
- Recipient: ${input.recipient}
- Relationship: ${input.relationship}
- City: ${city}
- Notes: ${input.notes || 'None'}

Generate a tailored gift combination within the ₹${budget} budget.
Available catalog product categories: Fresh Dutch Roses, Artisanal Truffles/Ferrero Rocher, Keepsake Cards, Scented Soy Candles, Acrylic Frames.

Return JSON strictly formatted as:
{
  "title": "Short poetic name for the combo",
  "reasoning": "1-2 sentences explaining why this exact combination was selected for the recipient and budget in ${city}",
  "items": [
    { "name": "Item name", "quantity": 1, "price": 100, "image": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80" }
  ]
}`;

      const response = await aiInstance.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const rawText = response.text?.trim();
      if (rawText) {
        const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanedText);

        const itemsTotal = (parsed.items || []).reduce((acc: number, item: any) => acc + (item.price * (item.quantity || 1)), 0);

        const recommendation: GiftComboRecommendation = {
          id: `rec-${Date.now()}`,
          title: parsed.title || `Custom AI Curated Gift Set for ${input.recipient || 'Your Special One'}`,
          reasoning: parsed.reasoning || `AI optimized combination for ₹${budget} budget.`,
          totalPrice: itemsTotal || budget,
          budget,
          savings: Math.max(0, budget - itemsTotal),
          items: parsed.items && parsed.items.length > 0 ? parsed.items : [
            { name: '2 Long-Stem Dutch Red Roses', quantity: 1, price: 120, image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80' },
            { name: 'Cadbury Dairy Milk Silk (60g)', quantity: 1, price: 90, image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80' },
          ],
          packaging,
          recommendedCardMessage: cardMessage,
        };

        const alternativeCombos: GiftComboRecommendation[] = [
          {
            id: `alt-1`,
            title: `Floral & Candle Alternative for ${input.recipient || 'Them'}`,
            reasoning: 'Prioritizes long-lasting fragrance and floral stems.',
            totalPrice: Math.min(budget, recommendation.totalPrice),
            budget,
            savings: 15,
            items: [
              { name: '4 Dutch Roses Bouquet', quantity: 1, price: Math.max(50, recommendation.totalPrice - 40), image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80' },
              { name: 'Personalized Greeting Card', quantity: 1, price: 40, image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=400&q=80' },
            ],
            packaging: 'Silk Paper & Satin Bow',
            recommendedCardMessage: cardMessage,
          },
        ];

        return {
          recommendation,
          alternativeCombos,
          greetingMessage: cardMessage,
          reasoning: recommendation.reasoning,
          packagingSuggestion: packaging,
        };
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to algorithmic curator:', err);
    }
  }

  // Fallback curated combination engine
  let selectedItems: { name: string; quantity: number; price: number; image: string }[] = [];
  let title = 'Custom AI Curated Gift Set';

  if (budget <= 200) {
    selectedItems = [
      { name: '1 Fresh Dutch Red Rose', quantity: 1, price: 60, image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80' },
      { name: 'Cadbury Dairy Milk (13.2g)', quantity: 2, price: 40, image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80' },
      { name: 'Handwritten Gold Mini Tag', quantity: 1, price: 20, image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=400&q=80' },
    ];
    title = `The Pocket Joy Set for ${input.recipient || 'Your Special One'}`;
  } else if (budget <= 350) {
    selectedItems = [
      { name: '2 Long-Stem Dutch Red Roses', quantity: 1, price: 120, image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80' },
      { name: 'Cadbury Dairy Milk Silk (60g)', quantity: 1, price: 90, image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80' },
      { name: 'Gold Foil Embossed Greeting Card', quantity: 1, price: 35, image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=400&q=80' },
    ];
    title = `The Sweet Affection Combo for ${input.recipient || 'Your Loved One'}`;
  } else if (budget <= 600) {
    selectedItems = [
      { name: '3 Dutch Roses & Gypsophila Accent', quantity: 1, price: 210, image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80' },
      { name: 'Cadbury Celebrations Box (113g)', quantity: 1, price: 180, image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80' },
      { name: 'Luxury Gold Foil Greeting Card', quantity: 1, price: 49, image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=400&q=80' },
    ];
    title = `Celebration Classic Hamper for ${input.recipient || 'Your Special One'}`;
  } else {
    selectedItems = [
      { name: '8 Golden Ferrero Rocher Truffles', quantity: 1, price: 450, image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80' },
      { name: 'Preserved Velvet Rose in Glass Dome', quantity: 1, price: 550, image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=400&q=80' },
      { name: 'Embossed Custom Gold Card', quantity: 1, price: 50, image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=400&q=80' },
    ];
    title = `Royal Luxury Treasure for ${input.recipient || 'Your Beloved'}`;
  }

  const itemsTotal = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const reasoning = `AI selected a balanced combination of fresh Dutch roses and artisanal chocolates instead of a single expensive bouquet. This maximizes perceived luxury and emotional sweetness within your exact budget of ₹${budget} in ${city}.`;

  const recommendation: GiftComboRecommendation = {
    id: `rec-${Date.now()}`,
    title,
    reasoning,
    totalPrice: itemsTotal,
    budget,
    savings: Math.max(0, budget - itemsTotal),
    items: selectedItems,
    packaging,
    recommendedCardMessage: cardMessage,
  };

  const alternativeCombos: GiftComboRecommendation[] = [
    {
      id: `alt-1`,
      title: `Floral Focused Alternative for ${input.recipient || 'Them'}`,
      reasoning: 'Prioritizes maximum fresh floral stem count and silk ribbon wrap.',
      totalPrice: Math.min(budget, itemsTotal),
      budget,
      savings: 15,
      items: [
        { name: '4 Dutch Roses Bouquet', quantity: 1, price: itemsTotal - 30, image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80' },
        { name: 'Personalized Mini Note', quantity: 1, price: 30, image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=400&q=80' },
      ],
      packaging: 'Silk Paper & Satin Bow',
      recommendedCardMessage: cardMessage,
    },
  ];

  return {
    recommendation,
    alternativeCombos,
    greetingMessage: cardMessage,
    reasoning,
    packagingSuggestion: packaging,
  };
}

// 6. Bloomora AI Simple Conversational Chat Concierge (Phase 1)
export async function generateAIChatResponse(
  history: { role: 'user' | 'assistant'; content: string }[],
  userQuery: string
): Promise<{ text: string; action?: { label: string; href: string } }> {
  const queryLower = userQuery.toLowerCase().trim();

  if (aiInstance) {
    try {
      const historyContext = history
        .slice(-6)
        .map((m) => `${m.role === 'user' ? 'Customer' : 'Bloomora AI'}: ${m.content}`)
        .join('\n');

      const systemPrompt = `You are Bloomora AI, the virtual luxury gifting concierge for Bloomora.
Bloomora is a hyperlocal premium gifting and surprise platform in India.

CRITICAL RULES:
1. ABSOLUTELY NO EMOJIS OR EMOTICONS. Use clear, elegant typography text only.
2. DO NOT INVENT fake products, fake prices, unbacked discount codes, fake delivery promises, non-existent partner stores, or fake policies.
3. Be warm, concise (2-4 sentences), helpful, and sophisticated.
4. When relevant, guide customers to valid Bloomora sections:
   - Gift Catalog / Shop Gifts: /catalog
   - Surprise Services (ready-to-book celebration boxes & hampers): /surprises
   - Surprise Planner (custom surprise execution requests - 3 days lead time required): /surprise-planner
   - Meet Me There (₹10 store pickup): /meet-me-there
   - Custom Studio (custom builder): /custom-builder
   - Gift Finder wizard: /ai-concierge

BLOOMORA KNOWLEDGE CONTEXT:
- Ready-to-Book Surprise Services (/surprises): Curated celebration packages combining cake, flowers, chocolates, decor, candles, card, and small gifts. Starting reference tiers: Mini (₹1,500), Classic (₹2,000), Signature (₹3,000), Grand (₹5,000).
- Custom Surprise Planner (/surprise-planner): Custom execution request system for unique surprise visions (e.g. workplace desk surprise for 15 people). Must be submitted at least 3 days before the event date for Bloomora team review, coordination, and quotation.
- Products: Fresh Dutch Roses, Artisanal Ferrero Rocher Truffle Bouquets, Preserved Velvet Roses in Carved Wooden Chests, Illuminated Photo Acrylic Memory Frames, Vanilla Soy Candle Hampers.
- Features: "Meet Me There" signature ₹10 destination pickup service at partner stores.

Format your response as valid JSON strictly with this structure:
{
  "text": "Your helpful response here without emojis.",
  "action": { "label": "Button Label", "href": "/relevant-route" }
}
(The action field is optional. If no route is relevant, omit action or set to null).

Conversation context:
${historyContext}
Customer query: ${userQuery}`;

      const response = await aiInstance.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: systemPrompt,
      });

      const rawText = response.text?.trim();
      if (rawText) {
        const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

        // Attempt to parse JSON response
        try {
          const parsed = JSON.parse(cleanedText);
          const sanitizedText = (parsed.text || rawText).replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
          
          let action: { label: string; href: string } | undefined = undefined;
          if (parsed.action && parsed.action.href && parsed.action.label) {
            action = {
              label: parsed.action.label.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, ''),
              href: parsed.action.href,
            };
          }

          return { text: sanitizedText, action };
        } catch {
          // If Gemini returned plain text instead of JSON
          const sanitizedText = rawText.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
          return { text: sanitizedText };
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed for Bloomora AI Chat:', err);
    }
  }

  // Fallback Rule-Based Concierge Engine if Gemini is unavailable
  if (queryLower.includes('planner') || queryLower.includes('plan a surprise') || queryLower.includes('custom surprise') || queryLower.includes('how early')) {
    return {
      text: 'Bloomora Surprise Planner is our custom surprise execution system. For unique surprise visions, submit your request at least 3 days before the event. Our team will review your requirements, coordinate with local partners, and contact you with custom pricing.',
      action: { label: 'Request Custom Planning', href: '/surprise-planner' },
    };
  }

  if (queryLower.includes('package') || queryLower.includes('surprise service') || queryLower.includes('2000') || queryLower.includes('3000') || queryLower.includes('5000') || queryLower.includes('1500')) {
    return {
      text: 'Bloomora offers ready-to-book Surprise Services starting at ₹1,500 (Mini), ₹2,000 (Classic), ₹3,000 (Signature), and ₹5,000 (Grand). Packages include cake, fresh flowers, chocolates, greeting cards, and setup options.',
      action: { label: 'Explore Surprise Packages', href: '/surprises' },
    };
  }

  if (queryLower.includes('girlfriend') || queryLower.includes('wife') || queryLower.includes('love') || queryLower.includes('romantic')) {
    return {
      text: 'For romantic occasions, Bloomora recommends our 2 Dutch Red Roses paired with Dairy Milk Silk (A Beautiful Birthday Surprise at ₹249) or our Eternal Rose in a Carved Wooden Chest. You can also explore our Romantic Surprise Packages.',
      action: { label: 'Explore Romantic Gifts', href: '/catalog' },
    };
  }

  if (queryLower.includes('mom') || queryLower.includes('mother') || queryLower.includes('father') || queryLower.includes('parents')) {
    return {
      text: 'For parents, we recommend our warm floral arrangements, vanilla soy candle chests, and illuminated photo acrylic memory frames.',
      action: { label: 'Explore Gift Catalog', href: '/catalog' },
    };
  }

  if (queryLower.includes('birthday')) {
    return {
      text: 'Bloomora offers ready-to-book Birthday Surprise Services (Mini ₹1,500, Classic ₹2,000, Signature ₹3,000, Grand ₹5,000) with gourmet cake, flowers, and chocolates. For custom event planning, submit a request 3 days in advance.',
      action: { label: 'Explore Birthday Packages', href: '/surprises' },
    };
  }

  if (queryLower.includes('under') || queryLower.includes('budget')) {
    return {
      text: 'Bloomora offers gifts across all price tiers: Pocket Surprises under ₹199, Romantic Classics from ₹300 to ₹499, Grand Celebration Hampers under ₹999, and Royal Preserved Rose Chests for ₹1000 and above.',
      action: { label: 'View All Gifts', href: '/catalog' },
    };
  }

  if (queryLower.includes('surprise')) {
    return {
      text: 'Bloomora provides ready-to-book Surprise Services (starting ₹1,500) and custom Surprise Execution Requests (submitted 3 days in advance) for birthdays, anniversaries, and workplace celebrations.',
      action: { label: 'Explore Surprise Services', href: '/surprises' },
    };
  }

  if (queryLower.includes('meet me there') || queryLower.includes('pickup') || queryLower.includes('partner store')) {
    return {
      text: 'Meet Me There is Bloomora signature destination pickup service. Select your preferred partner store along your route and collect your hand-crafted gift for a flat ₹10 pickup fee.',
      action: { label: 'Learn About Meet Me There', href: '/meet-me-there' },
    };
  }

  if (queryLower.includes('custom') || queryLower.includes('customize')) {
    return {
      text: 'In our Custom Studio, you can choose individual blooms, sweet treats, rigid keepsake boxes, satin ribbons, and custom handwritten cards to create your personalized hamper.',
      action: { label: 'Open Custom Studio', href: '/custom-builder' },
    };
  }

  return {
    text: 'Welcome to Bloomora. I am your virtual gifting concierge, ready to assist you with ready-to-book surprise services, custom surprise planning requests, and hand-crafted floral arrangements tailored to your budget.',
    action: { label: 'Explore Gift Catalog', href: '/catalog' },
  };
}

