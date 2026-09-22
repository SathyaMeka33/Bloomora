"""
Bloomora Gift Intelligence Engine
Calculates Gift Fit Score and generates accurate, personalized AI recommendations.
"""
from apps.catalog.models import Product
from .models import GiftIntent
import re


RELATIONSHIP_TAG_MAP = {
    'partner': ['for-her', 'for-him', 'partner', 'love', 'romantic', 'anniversary'],
    'lover': ['for-her', 'for-him', 'partner', 'love', 'romantic', 'anniversary'],
    'wife': ['for-her', 'partner', 'wife', 'love', 'romantic', 'anniversary'],
    'girlfriend': ['for-her', 'partner', 'girlfriend', 'love', 'romantic', 'anniversary'],
    'husband': ['for-him', 'partner', 'husband', 'love', 'romantic', 'anniversary'],
    'boyfriend': ['for-him', 'partner', 'boyfriend', 'love', 'romantic', 'anniversary'],
    'fiance': ['for-her', 'for-him', 'partner', 'love', 'proposal', 'anniversary'],
    'mother': ['for-parents', 'for-her', 'mother', 'mom'],
    'mom': ['for-parents', 'for-her', 'mother', 'mom'],
    'father': ['for-parents', 'for-him', 'father', 'dad'],
    'dad': ['for-parents', 'for-him', 'father', 'dad'],
    'parents': ['for-parents', 'mother', 'father'],
    'sibling': ['sibling', 'brother', 'sister', 'for-friends'],
    'brother': ['sibling', 'brother', 'for-him', 'for-friends'],
    'sister': ['sibling', 'sister', 'for-her', 'for-friends'],
    'friend': ['for-friends', 'friend', 'best-friend'],
    'best-friend': ['for-friends', 'friend', 'best-friend'],
    'colleague': ['for-colleagues', 'corporate', 'executive', 'colleague'],
    'mentor': ['for-colleagues', 'corporate', 'executive', 'mentor'],
    'teacher': ['for-colleagues', 'corporate', 'executive', 'teacher'],
    'neighbour': ['for-friends', 'home-decor', 'plants', 'sweets'],
    'child': ['kids-gifting', 'child', 'kids', 'baby-gifts'],
    'kids': ['kids-gifting', 'child', 'kids'],
    'baby': ['baby-gifts', 'baby', 'new-baby'],
}

GIFT_TYPE_CATEGORIES = {
    'flowers': ['flowers'],
    'bouquets': ['bouquets'],
    'cakes': ['cakes', 'cakes-desserts'],
    'cakes-desserts': ['cakes', 'cakes-desserts'],
    'chocolate-bouquets': ['chocolate-bouquets'],
    'food-gourmet': ['gourmet-hampers', 'food-gourmet'],
    'gourmet-hampers': ['gourmet-hampers', 'food-gourmet'],
    'personalized': ['personalized', 'personalized-gifts'],
    'personalized-gifts': ['personalized', 'personalized-gifts'],
    'custom-gifts': ['custom-gifts'],
    'jewellery': ['jewellery'],
    'fragrances-candles': ['fragrances-candles'],
    'beauty-wellness': ['beauty-wellness'],
    'plants': ['plants'],
    'books-stationery': ['books-stationery'],
    'corporate-gifts': ['corporate-gifts'],
    'kids-gifting': ['kids-gifting', 'toys-games'],
    'toys-games': ['kids-gifting', 'toys-games'],
    'baby-gifts': ['baby-gifts'],
    'premium-gifts': ['premium-gifts', 'luxury-premium'],
    'luxury-premium': ['premium-gifts', 'luxury-premium'],
    'mini-gifts': ['mini-gifts'],
}


def extract_gift_type_preference(free_text: str) -> str:
    """Extract explicit gift type if present in free text."""
    if not free_text:
        return ''
    match = re.search(r'gift type preference:\s*([a-zA-Z0-9_-]+)', free_text, re.IGNORECASE)
    if match:
        return match.group(1).lower().strip()
    return ''


def calculate_fit_score(product: Product, intent: GiftIntent) -> tuple[int, float, str]:
    """
    Weighted Multidimensional Gift Fit Scoring (0 - 100):
    - Category / Gift Type: 30 pts
    - Relationship: 25 pts
    - Occasion: 20 pts
    - Budget: 15 pts
    - Emotion & Interests: 10 pts
    """
    cat_slug = product.category.slug.lower() if product.category else ''
    product_tags = [t.lower() for t in (product.tags or [])]
    product_emotions = [e.lower() for e in (product.emotions or [])]
    product_recipients = [r.lower() for r in (product.recipient_types or [])]
    product_interests = [i.lower() for i in (product.interests or [])]
    product_name_lower = product.name.lower()
    product_desc_lower = (product.description or '').lower()

    score = 0
    reasons = []

    # 1. Category / Gift Type (30 pts max)
    requested_gift_type = extract_gift_type_preference(intent.free_text)
    if requested_gift_type:
        valid_categories = GIFT_TYPE_CATEGORIES.get(requested_gift_type, [requested_gift_type])
        if cat_slug in valid_categories:
            score += 30
            reasons.append(f"matches your desired {requested_gift_type.replace('-', ' ').title()} category")
        elif (
            requested_gift_type in product_tags
            or any(s in product_tags for s in valid_categories)
            or any(s in product_name_lower for s in valid_categories)
        ):
            score += 15
            reasons.append(f"matches your desired {requested_gift_type.replace('-', ' ').title()} theme")
        else:
            # Different category than requested
            score += 0
    else:
        # Open AI discovery
        score += 15

    # 2. Relationship (25 pts max)
    if intent.relationship:
        rel_clean = intent.relationship.lower().strip()
        matching_tags = RELATIONSHIP_TAG_MAP.get(rel_clean, [rel_clean, f"for-{rel_clean}"])
        rel_matched = any(
            t in product_recipients or t in product_tags or t in product_desc_lower
            for t in matching_tags
        )
        if rel_matched:
            score += 25
            rel_label = intent.relationship.replace('-', ' ').title()
            reasons.append(f"curated thoughtfully for your {rel_label}")
        elif 'for-friends' in product_recipients or 'for-her' in product_recipients or 'for-him' in product_recipients:
            score += 10
    else:
        score += 15

    # 3. Occasion (20 pts max)
    if intent.occasion:
        occ_clean = intent.occasion.lower().replace('-', ' ').strip()
        product_occasions = [occ.slug.lower().replace('-', ' ') for occ in product.occasions.all()]
        product_occ_names = [occ.name.lower() for occ in product.occasions.all()]

        occ_matched = (
            any(occ_clean in o or o in occ_clean for o in product_occasions)
            or any(occ_clean in o or o in occ_clean for o in product_occ_names)
            or any(occ_clean in t for t in product_tags)
            or occ_clean in product_desc_lower
        )
        if occ_matched:
            score += 20
            occ_label = intent.occasion.replace('-', ' ').title()
            reasons.append(f"perfectly suited for {occ_label}")
        elif 'love' in occ_clean and ('romance' in product_tags or 'roses' in product_tags):
            score += 12
            reasons.append("radiates romantic warmth")
        else:
            score += 5
    else:
        score += 10

    # 4. Budget Fit (15 pts max)
    price = float(product.price)
    b_max = float(intent.budget_max) if intent.budget_max else None
    b_min = float(intent.budget_min) if intent.budget_min else None

    if b_max:
        if price <= b_max:
            if b_min and price >= b_min:
                score += 15
                reasons.append(f"ideal fit for your Rs. {int(b_min)}–Rs. {int(b_max)} budget")
            else:
                score += 10
                reasons.append(f"well within your Rs. {int(b_max)} budget")
        elif price <= b_max * 1.15:
            score += 3
        else:
            score -= 15
    else:
        score += 10

    # 5. Emotion & Interests (10 pts max)
    if intent.emotion:
        emo_clean = intent.emotion.lower().strip()
        if emo_clean in product_emotions or any(emo_clean in t for t in product_tags):
            score += 5
            reasons.append(f"evokes a genuine feeling of being {intent.emotion.lower()}")
        elif emo_clean in product_desc_lower:
            score += 3

    if intent.interests:
        matched_interests = []
        for interest in intent.interests:
            i_clean = interest.lower().strip()
            if (
                i_clean in product_interests
                or i_clean in product_tags
                or i_clean in product_name_lower
                or i_clean in product_desc_lower
            ):
                matched_interests.append(interest)

        if matched_interests:
            score += min(5, len(matched_interests) * 3)
            reasons.append(f"aligns with interests in {', '.join(matched_interests[:2])}")

    # Micro bonuses
    if intent.urgency == 'today' and product.same_day_available:
        score += 3
        reasons.append("available for express same-day handoff")

    if product.customizable:
        score += 2

    # Clamping between 30 and 99
    score = max(30, min(99, score))
    confidence = round(score / 100, 2)

    recipient_name = intent.recipient_name or 'them'
    if not reasons:
        reasons = ["hand-selected by Bloomora Gift Intelligence for quality and elegance"]

    why = f"Chosen for {recipient_name}: {', '.join(reasons[:3])}."
    return score, confidence, why


def get_recommendations(intent: GiftIntent, limit: int = 8) -> list[dict]:
    """
    Main recommendation engine.
    Scores catalog products and returns the highest Gift Fit matches.
    """
    qs = Product.objects.filter(active=True, stock__gt=0).select_related('seller', 'category').prefetch_related('occasions')

    if intent.budget_max:
        max_allowed = float(intent.budget_max) * 1.25
        qs = qs.filter(price__lte=max_allowed)

    requested_gift_type = extract_gift_type_preference(intent.free_text)
    valid_categories = GIFT_TYPE_CATEGORIES.get(requested_gift_type, [requested_gift_type]) if requested_gift_type else []

    scored = []
    for product in qs:
        score, confidence, why = calculate_fit_score(product, intent)
        cat_slug = product.category.slug.lower() if product.category else ''
        is_exact_cat = 1 if (valid_categories and cat_slug in valid_categories) else 0

        scored.append({
            'product': product,
            'fit_score': score,
            'confidence': confidence,
            'why_this_gift': why,
            '_exact_cat': is_exact_cat,
        })

    # Sort primarily by exact category match when requested, then by fit_score descending
    scored.sort(key=lambda x: (x['_exact_cat'], x['fit_score']), reverse=True)
    return scored[:limit]
