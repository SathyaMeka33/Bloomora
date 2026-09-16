"""
Bloomora Taxonomy App — Views
Endpoints:
  GET /api/taxonomy/                  — Full taxonomy tree
  GET /api/gift-types/                — Root gift types with subcategories
  GET /api/gift-types/{id}/subcategories/
  GET /api/occasion-types/            — Root occasion types with subcategories
  GET /api/occasion-types/{id}/subcategories/
  GET /api/recipient-types/
  GET /api/gift-intents/
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.core.cache import cache

from .models import GiftType, OccasionType, RecipientType, GiftIntentTag
from .serializers import (
    GiftTypeSerializer, OccasionTypeSerializer,
    RecipientTypeSerializer, GiftIntentTagSerializer,
)

CACHE_TTL = 60 * 60  # 1 hour


class TaxonomyView(APIView):
    """GET /api/taxonomy/ — Full combined taxonomy (cached)."""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        cached = cache.get('bloomora_taxonomy')
        if cached:
            return Response({'success': True, 'data': cached})

        gift_types = GiftType.objects.filter(is_active=True, parent__isnull=True).prefetch_related('subcategories')
        occasion_types = OccasionType.objects.filter(is_active=True, parent__isnull=True).prefetch_related('subcategories')
        recipient_types = RecipientType.objects.filter(is_active=True)
        gift_intents = GiftIntentTag.objects.filter(is_active=True)

        ctx = {'include_subcategories': True}
        data = {
            'gift_types': GiftTypeSerializer(gift_types, many=True, context=ctx).data,
            'occasion_types': OccasionTypeSerializer(occasion_types, many=True, context=ctx).data,
            'recipient_types': RecipientTypeSerializer(recipient_types, many=True).data,
            'gift_intents': GiftIntentTagSerializer(gift_intents, many=True).data,
        }

        cache.set('bloomora_taxonomy', data, CACHE_TTL)
        return Response({'success': True, 'data': data})


class GiftTypeListView(APIView):
    """GET /api/gift-types/ — Root gift types (with optional ?all=true for all levels)."""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        qs = GiftType.objects.filter(is_active=True, parent__isnull=True).prefetch_related('subcategories')
        ctx = {'include_subcategories': request.query_params.get('subs', 'true') == 'true'}
        return Response({
            'success': True,
            'count': qs.count(),
            'data': GiftTypeSerializer(qs, many=True, context=ctx).data,
        })


class GiftTypeSubcategoryView(APIView):
    """GET /api/gift-types/{id}/subcategories/"""
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        try:
            parent = GiftType.objects.get(pk=pk, is_active=True)
        except GiftType.DoesNotExist:
            return Response({'success': False, 'message': 'Gift type not found'}, status=404)
        subs = parent.subcategories.filter(is_active=True)
        return Response({
            'success': True,
            'parent': GiftTypeSerializer(parent).data,
            'data': GiftTypeSerializer(subs, many=True).data,
        })


class OccasionTypeListView(APIView):
    """GET /api/occasion-types/ — Root occasion types."""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        qs = OccasionType.objects.filter(is_active=True, parent__isnull=True).prefetch_related('subcategories')
        ctx = {'include_subcategories': request.query_params.get('subs', 'true') == 'true'}
        return Response({
            'success': True,
            'count': qs.count(),
            'data': OccasionTypeSerializer(qs, many=True, context=ctx).data,
        })


class OccasionTypeSubcategoryView(APIView):
    """GET /api/occasion-types/{id}/subcategories/"""
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        try:
            parent = OccasionType.objects.get(pk=pk, is_active=True)
        except OccasionType.DoesNotExist:
            return Response({'success': False, 'message': 'Occasion type not found'}, status=404)
        subs = parent.subcategories.filter(is_active=True)
        return Response({
            'success': True,
            'parent': OccasionTypeSerializer(parent).data,
            'data': OccasionTypeSerializer(subs, many=True).data,
        })


class RecipientTypeListView(APIView):
    """GET /api/recipient-types/"""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        qs = RecipientType.objects.filter(is_active=True)
        return Response({
            'success': True,
            'count': qs.count(),
            'data': RecipientTypeSerializer(qs, many=True).data,
        })


class GiftIntentListView(APIView):
    """GET /api/gift-intents/"""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        qs = GiftIntentTag.objects.filter(is_active=True)
        return Response({
            'success': True,
            'count': qs.count(),
            'data': GiftIntentTagSerializer(qs, many=True).data,
        })
