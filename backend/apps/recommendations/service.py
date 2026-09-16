"""
Bloomora Gift Intelligence Engine
Calculates Gift Fit Score and generates AI recommendations.
"""
from apps.catalog.models import Product
from .models import GiftIntent, Recommendation
import random


def calculate_fit_score(product: Product, intent: GiftIntent) -> tuple[int, float, str]:
    """
    Calculate Gift Fit Score for a product given a gift intent.
    Returns: (score 0-100, confidence 0.0-1.0, why_this_gift explanation)
    """
    score = 50  # Base score
    reasons = []

    # Budget match
    if intent.budget_max:
        if product.price <= intent.budget_max:
            score += 15
            reasons.append(f"within your ₹{intent.budget_max} budget")
            if intent.budget_min and product.price >= intent.budget_min:
                score += 5
                reasons.append("perfect budget match")
        else:
            score -= 20

    # Occasion match
    if intent.occasion:
        product_occasions = [occ.slug for occ in product.occasions.all()]
        if intent.occasion.lower() in [o.lower() for o in product_occasions]:
            score += 15
            reasons.append(f"perfect for {intent.occasion}")

    # Interest/tag match
    if intent.interests:
        product_tags = [t.lower() for t in (product.tags or [])]
        matched = [i for i in intent.interests if i.lower() in product_tags or i.lower() in (product.interests or [])]
        if matched:
            score += min(15, len(matched) * 5)
            reasons.append(f"matches interests: {', '.join(matched[:2])}")

    # Emotion match
    if intent.emotion:
        product_emotions = [e.lower() for e in (product.emotions or [])]
        if intent.emotion.lower() in product_emotions:
            score += 10
            reasons.append(f"evokes feeling of being {intent.emotion}")

    # Stock availability
    if product.in_stock:
        score += 5
    else:
        score -= 30

    # Same-day delivery if urgent
    if intent.urgency == 'today' and product.same_day_available:
        score += 10
        reasons.append("available for same-day delivery")

    # Customization
    if product.customizable:
        score += 5
        reasons.append("can be personalized")

    # Bestseller boost
    if product.is_best_seller:
        score += 5
        reasons.append("Bloomora bestseller")

    # Clamp score to 0-100
    score = max(0, min(100, score))
    confidence = round(score / 100, 2)

    if not reasons:
        reasons = ["curated by Bloomora's gift intelligence"]

    why = f"This gift is {', '.join(reasons[:3])}"
    return score, confidence, why


def get_recommendations(intent: GiftIntent, limit: int = 8) -> list[dict]:
    """
    Main recommendation engine.
    Returns ranked list of products with fit scores.
    """
    # Build base queryset
    qs = Product.objects.filter(active=True, stock__gt=0)

    # Filter by budget
    if intent.budget_max:
        qs = qs.filter(price__lte=intent.budget_max)
    if intent.budget_min:
        qs = qs.filter(price__gte=intent.budget_min)

    # Filter by location
    if intent.location:
        qs = qs.filter(delivery_area__icontains=intent.location) | Product.objects.filter(active=True, same_day_available=True)

    # Prefetch for efficiency
    qs = qs.select_related('seller', 'category').prefetch_related('occasions')

    # Score all products
    scored = []
    for product in qs[:50]:  # Limit evaluation set
        score, confidence, why = calculate_fit_score(product, intent)
        scored.append({
            'product': product,
            'fit_score': score,
            'confidence': confidence,
            'why_this_gift': why,
        })

    # Sort by fit score
    scored.sort(key=lambda x: x['fit_score'], reverse=True)
    return scored[:limit]
