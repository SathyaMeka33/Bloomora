"""
Bloomora AI App - Views
AI Gift Finder, Chat Concierge, Message Generator, Budget Optimizer
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from .models import AIConversation, AIMessage
from .service import (
    generate_gift_message_ai,
    chat_with_bloomora_ai,
    generate_gift_recommendations_with_ai,
    optimize_budget,
)
from apps.recommendations.service import get_recommendations
from apps.recommendations.models import GiftIntent
from apps.catalog.serializers import ProductListSerializer


class GiftFinderAIView(APIView):
    """POST /api/ai/gift-finder/ - Full AI gift discovery with Gemini enhancement."""
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def post(self, request):
        # Build intent
        intent = GiftIntent(
            user=request.user if request.user.is_authenticated else None,
            recipient_name=request.data.get("recipient", {}).get("name", "") if isinstance(request.data.get("recipient"), dict) else str(request.data.get("recipient", "")),
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

        # Rule-based recommendations
        recommendations = get_recommendations(intent, limit=10)

        # Enhance with AI (Gemini) if available
        recommendations = generate_gift_recommendations_with_ai(request.data, recommendations)

        # Re-sort after AI enhancement
        recommendations.sort(key=lambda x: x["fit_score"], reverse=True)

        results = []
        for rank, rec in enumerate(recommendations[:8], 1):
            product_data = ProductListSerializer(rec["product"]).data
            results.append({
                "rank": rank,
                "fit_score": rec["fit_score"],
                "confidence": rec["confidence"],
                "why_this_gift": rec["why_this_gift"],
                "product": product_data,
                "delivery_estimate": f"{rec['product'].delivery_time_hours}h" if rec["product"].delivery_time_hours else "24-48h",
                "personalization_available": rec["product"].customizable,
            })

        return Response({
            "intent_id": intent.id,
            "total": len(results),
            "recommendations": results,
        })


class AIChatView(APIView):
    """POST /api/ai/chat/ - Bloomora Gifting AI chat."""
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def post(self, request):
        message = request.data.get("message", "")
        conversation_id = request.data.get("conversation_id")
        context = request.data.get("context", {})

        # Get or create conversation
        if conversation_id:
            try:
                conversation = AIConversation.objects.get(
                    id=conversation_id,
                    user=request.user if request.user.is_authenticated else None
                )
            except AIConversation.DoesNotExist:
                conversation = AIConversation.objects.create(
                    user=request.user if request.user.is_authenticated else None
                )
        else:
            conversation = AIConversation.objects.create(
                user=request.user if request.user.is_authenticated else None,
                context=context
            )

        # Save user message
        AIMessage.objects.create(
            conversation=conversation, role="user", content=message
        )

        # Get conversation history
        history = list(
            conversation.messages.order_by("created_at").values("role", "content")
        )

        # Generate AI response
        ai_response = chat_with_bloomora_ai(history[:-1], message, context)

        # Save AI response
        AIMessage.objects.create(
            conversation=conversation, role="assistant", content=ai_response
        )

        return Response({
            "conversation_id": conversation.id,
            "response": ai_response,
        })


class AIConversationListView(APIView):
    """GET /api/ai/conversations/"""
    def get(self, request):
        if not request.user.is_authenticated:
            return Response([])
        convs = AIConversation.objects.filter(user=request.user).order_by("-updated_at")[:10]
        return Response([{"id": c.id, "created_at": c.created_at, "updated_at": c.updated_at} for c in convs])


class AIConversationDetailView(APIView):
    """GET /api/ai/conversations/{id}/"""
    def get(self, request, pk):
        try:
            conv = AIConversation.objects.get(id=pk, user=request.user)
            messages = conv.messages.order_by("created_at")
            return Response({
                "id": conv.id,
                "messages": [{"role": m.role, "content": m.content, "created_at": m.created_at} for m in messages]
            })
        except AIConversation.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


class AIGreetingMessageView(APIView):
    """POST /api/ai/greeting-message/ - Generate gift message."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        recipient = request.data.get("recipient", "Someone Special")
        occasion = request.data.get("occasion", "birthday")
        relationship = request.data.get("relationship", "friend")
        emotion = request.data.get("emotion", "")
        tone = request.data.get("tone", "warm")
        length = request.data.get("length", "medium")

        message = generate_gift_message_ai(recipient, occasion, relationship, emotion, tone, length)
        return Response({"message": message})


class AIBudgetOptimizerView(APIView):
    """POST /api/ai/budget-optimizer/"""
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def post(self, request):
        from apps.recommendations.service import get_recommendations
        from apps.recommendations.models import GiftIntent

        budget = float(request.data.get("budget", 1000))
        intent = GiftIntent(
            occasion=request.data.get("occasion", "birthday"),
            budget_max=budget,
        )
        intent.save()

        recommendations = get_recommendations(intent, limit=5)
        result = optimize_budget(budget, recommendations)
        return Response(result)
