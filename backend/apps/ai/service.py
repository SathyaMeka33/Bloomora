"""
Bloomora AI Service Layer
Provider-agnostic, defaults to Google Gemini
"""
import json
from django.conf import settings


def get_gemini_client():
    """Get Google Gemini client if key is configured."""
    if settings.GEMINI_API_KEY:
        try:
            import google.generativeai as genai
            genai.configure(api_key=settings.GEMINI_API_KEY)
            return genai.GenerativeModel("gemini-1.5-flash")
        except Exception:
            return None
    return None


def generate_gift_recommendations_with_ai(intent_data: dict, products: list) -> list:
    """
    Use Gemini to enhance gift recommendations with AI reasoning.
    Falls back to rule-based scoring if Gemini unavailable.
    """
    client = get_gemini_client()
    if not client:
        return products  # Return as-is, rule-based scores already applied

    try:
        products_summary = [
            {"name": p["product"].name, "price": float(p["product"].price),
             "tags": p["product"].tags, "id": p["product"].id}
            for p in products[:10]
        ]
        
        prompt = f"""You are Bloomora's Gift Intelligence Engine.
        
Gift Intent:
- Relationship: {intent_data.get("relationship", "friend")}
- Occasion: {intent_data.get("occasion", "birthday")}
- Emotion goal: {intent_data.get("emotion", "")}
- Interests: {", ".join(intent_data.get("interests", []))}
- Budget: ₹{intent_data.get("budget_max", 1000)}
- Free text: {intent_data.get("free_text", "")}

Products (top candidates):
{json.dumps(products_summary, indent=2)}

For each product, provide:
1. A "why_this_gift" explanation (1-2 sentences, specific to this recipient)
2. An enhanced fit_score (0-100)

Respond ONLY with a JSON array:
[{{"id": product_id, "fit_score": number, "why_this_gift": "..."}}]
No other text."""

        response = client.generate_content(prompt)
        text = response.text.strip()
        
        # Extract JSON
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()
        
        ai_results = json.loads(text)
        
        # Merge AI results back
        ai_by_id = {item["id"]: item for item in ai_results}
        for p in products:
            product_id = p["product"].id
            if product_id in ai_by_id:
                p["fit_score"] = ai_by_id[product_id].get("fit_score", p["fit_score"])
                p["why_this_gift"] = ai_by_id[product_id].get("why_this_gift", p["why_this_gift"])
        
        return products
    except Exception as e:
        return products  # Graceful fallback


def generate_gift_message_ai(recipient: str, occasion: str, relationship: str, emotion: str = "", tone: str = "warm", length: str = "medium") -> str:
    """Generate AI gift message using Gemini."""
    client = get_gemini_client()
    
    if client:
        try:
            prompt = f"""Write a heartfelt gift message for:
- Recipient: {recipient}
- Relationship: {relationship}
- Occasion: {occasion}
- Emotion to convey: {emotion or "warmth and love"}
- Tone: {tone}
- Length: {length} (short=2 lines, medium=3-4 lines, long=5-6 lines)

Write ONLY the message, no quotes or labels. Keep it personal and genuine."""
            response = client.generate_content(prompt)
            return response.text.strip()
        except Exception:
            pass
    
    # Fallback messages
    fallback_messages = {
        "birthday": f"Wishing you a wonderful birthday, {recipient}! May this day bring you as much joy as you bring to everyone around you.",
        "anniversary": f"Celebrating this beautiful milestone with you, {recipient}. Every moment with you is a gift worth treasuring.",
        "thank-you": f"Thank you, {recipient}, for everything you do. This small gesture comes from a grateful heart.",
    }
    return fallback_messages.get(occasion.lower(), f"A gift with love, just for you, {recipient}. Wishing you joy always.")


def chat_with_bloomora_ai(conversation_history: list, user_message: str, context: dict = None) -> str:
    """
    Bloomora Gifting AI Chat - understands gifting context.
    """
    client = get_gemini_client()
    
    if client:
        try:
            system_context = """You are the Bloomora AI Gifting Concierge — an expert in finding perfect gifts.
You help customers find personalized gifts for their loved ones.
You understand occasions, emotions, relationships, budgets, and local gifting culture in India.
You NEVER invent product availability, prices, or creator capabilities.
You ask clarifying questions to understand the recipient better.
Keep responses warm, concise, and helpful. Always suggest next steps."""

            if context:
                system_context += f"\nCurrent gift intent context: {json.dumps(context)}"

            # Build prompt with history
            history_text = "\n".join([f"{m['role'].upper()}: {m['content']}" for m in conversation_history[-6:]])
            full_prompt = f"{system_context}\n\nConversation:\n{history_text}\nUSER: {user_message}\nASSISTANT:"
            
            response = client.generate_content(full_prompt)
            return response.text.strip()
        except Exception as e:
            pass
    
    # Fallback response
    return "I am Bloomora's gifting assistant. Tell me about the person you're gifting and I will help you find the perfect present! Who are you shopping for today?"


def optimize_budget(budget: float, products: list) -> dict:
    """
    Budget optimizer - suggest best combination within budget.
    """
    main_gift = None
    additions = []
    total = 0

    # Try to fit main gift + extras
    for p in sorted(products, key=lambda x: x["fit_score"], reverse=True):
        price = float(p["product"].price)
        if not main_gift and price <= budget * 0.75:
            main_gift = p
            total += price
            break
    
    remaining = budget - total
    extras = [
        {"name": "Greeting Card", "price": 99},
        {"name": "Premium Gift Wrap", "price": 149},
        {"name": "Chocolates", "price": 199},
    ]
    
    for extra in extras:
        if remaining >= extra["price"]:
            additions.append(extra)
            remaining -= extra["price"]

    return {
        "main_gift": {"product": main_gift["product"].id, "price": float(main_gift["product"].price)} if main_gift else None,
        "additions": additions,
        "total": total + sum(e["price"] for e in additions),
        "remaining_budget": remaining,
        "budget": budget,
    }
