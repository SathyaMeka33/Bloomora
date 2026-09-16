"""
Bloomora Creators App - Serializers
"""
from rest_framework import serializers
from .models import Seller


class SellerSerializer(serializers.ModelSerializer):
    """Matches Bloomora API.yaml Seller schema."""
    user = serializers.ReadOnlyField(source='user.id')

    class Meta:
        model = Seller
        fields = [
            'id', 'user', 'business_name', 'description', 'location',
            'approved', 'creator_story', 'handmade', 'profile_image',
            'banner_image', 'supports_customization', 'supports_same_day',
            'lead_time_hours', 'delivery_radius_km', 'rating', 'total_orders',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'approved', 'rating', 'total_orders', 'created_at', 'updated_at']


class SellerPublicSerializer(serializers.ModelSerializer):
    """Public seller discovery."""
    user_email = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = Seller
        fields = [
            'id', 'business_name', 'description', 'location',
            'creator_story', 'handmade', 'profile_image', 'banner_image',
            'supports_customization', 'supports_same_day', 'lead_time_hours',
            'rating', 'total_orders', 'created_at',
        ]
