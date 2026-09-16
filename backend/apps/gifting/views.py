from rest_framework import generics
from .models import RecipientProfile, GiftDNA, GiftMemory
from .serializers import RecipientSerializer, GiftDNASerializer, GiftMemorySerializer


class GiftDNAListCreateView(generics.ListCreateAPIView):
    """GET/POST /api/gift-dna/"""
    serializer_class = GiftDNASerializer

    def get_queryset(self):
        return GiftDNA.objects.filter(recipient__user=self.request.user).select_related("recipient")


class GiftDNADetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET/PUT/DELETE /api/gift-dna/{id}/"""
    serializer_class = GiftDNASerializer

    def get_queryset(self):
        return GiftDNA.objects.filter(recipient__user=self.request.user)


class GiftMemoryListView(generics.ListCreateAPIView):
    """GET /api/gift-memory/"""
    serializer_class = GiftMemorySerializer

    def get_queryset(self):
        return GiftMemory.objects.filter(user=self.request.user).select_related("recipient","product")


class GiftMemoryByRecipientView(generics.ListAPIView):
    """GET /api/gift-memory/{recipient_id}/"""
    serializer_class = GiftMemorySerializer

    def get_queryset(self):
        return GiftMemory.objects.filter(
            user=self.request.user,
            recipient_id=self.kwargs["recipient_id"]
        )
