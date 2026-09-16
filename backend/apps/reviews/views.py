from rest_framework import generics, permissions
from .models import Review, Feedback
from .serializers import ReviewSerializer, FeedbackSerializer


class ReviewCreateView(generics.CreateAPIView):
    """POST /api/reviews/ - matches YAML."""
    serializer_class = ReviewSerializer


class ProductReviewListView(generics.ListAPIView):
    """GET /api/products/{id}/reviews/"""
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Review.objects.filter(product_id=self.kwargs['pk'])


class FeedbackCreateView(generics.CreateAPIView):
    """POST /api/feedback/ - matches YAML."""
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.AllowAny]
