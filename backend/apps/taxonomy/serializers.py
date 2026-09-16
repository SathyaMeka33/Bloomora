"""
Bloomora Taxonomy App — Serializers
"""
from rest_framework import serializers
from .models import GiftType, OccasionType, RecipientType, GiftIntentTag


class GiftTypeSerializer(serializers.ModelSerializer):
    subcategories = serializers.SerializerMethodField()

    class Meta:
        model = GiftType
        fields = [
            'id', 'name', 'slug', 'description', 'icon', 'image',
            'parent', 'display_order', 'is_featured', 'subcategories',
        ]

    def get_subcategories(self, obj):
        if not self.context.get('include_subcategories', False):
            return []
        subs = obj.subcategories.filter(is_active=True).order_by('display_order', 'name')
        return GiftTypeSerializer(subs, many=True, context={'include_subcategories': False}).data


class GiftTypeFlatSerializer(serializers.ModelSerializer):
    """Flat serializer without subcategories for nested use."""
    class Meta:
        model = GiftType
        fields = ['id', 'name', 'slug', 'icon', 'display_order']


class OccasionTypeSerializer(serializers.ModelSerializer):
    subcategories = serializers.SerializerMethodField()

    class Meta:
        model = OccasionType
        fields = [
            'id', 'name', 'slug', 'description', 'icon', 'emoji', 'image',
            'parent', 'display_order', 'is_featured', 'is_seasonal',
            'season_start', 'season_end', 'subcategories',
        ]

    def get_subcategories(self, obj):
        if not self.context.get('include_subcategories', False):
            return []
        subs = obj.subcategories.filter(is_active=True).order_by('display_order', 'name')
        return OccasionTypeSerializer(subs, many=True, context={'include_subcategories': False}).data


class OccasionTypeFlatSerializer(serializers.ModelSerializer):
    class Meta:
        model = OccasionType
        fields = ['id', 'name', 'slug', 'emoji', 'icon', 'display_order', 'is_seasonal']


class RecipientTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipientType
        fields = ['id', 'name', 'slug', 'emoji', 'display_order']


class GiftIntentTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = GiftIntentTag
        fields = ['id', 'name', 'slug', 'description']


class TaxonomySerializer(serializers.Serializer):
    """Combined taxonomy response for /api/taxonomy/"""
    gift_types = GiftTypeSerializer(many=True)
    occasion_types = OccasionTypeSerializer(many=True)
    recipient_types = RecipientTypeSerializer(many=True)
    gift_intents = GiftIntentTagSerializer(many=True)
