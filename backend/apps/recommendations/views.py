from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from .models import GiftIntent, Recommendation
from .service import get_recommendations
from apps.catalog.serializers import ProductListSerializer


class RecommendationView(APIView):
    """POST /api/recommendations/ - matches YAML."""
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def post(self, request):
        # Build intent
        intent = GiftIntent(
            user=request.user if request.user.is_authenticated else None,
            recipient_name=request.data.get("recipient", {}).get("name", ""),
            relationship=request.data.get("relationship", ""),
            occasion=request.data.get("occasion", ""),
            emotion=request.data.get("emotion", ""),
            interests=request.data.get("interests", []),
            budget_max=request.data.get("budget"),
            budget_min=request.data.get("budget_min"),
            location=request.data.get("location", ""),
            delivery_date=request.data.get("delivery_date"),
            urgency=request.data.get("urgency", ""),
            free_text=request.data.get("free_text", ""),
        )
        intent.save()

        # Get recommendations
        recommendations = get_recommendations(intent)

        # Save to DB
        results = []
        for rank, rec in enumerate(recommendations, 1):
            saved = Recommendation.objects.create(
                intent=intent,
                product=rec["product"],
                fit_score=rec["fit_score"],
                confidence=rec["confidence"],
                why_this_gift=rec["why_this_gift"],
                rank=rank,
                delivery_estimate=f"{rec['product'].delivery_time_hours}h" if rec["product"].delivery_time_hours else "24-48h",
            )
            product_data = ProductListSerializer(rec["product"]).data
            results.append({
                "rank": rank,
                "fit_score": rec["fit_score"],
                "confidence": rec["confidence"],
                "why_this_gift": rec["why_this_gift"],
                "product": product_data,
                "delivery_estimate": saved.delivery_estimate,
            })

        return Response({
            "intent_id": intent.id,
            "total": len(results),
            "recommendations": results,
        })
