"""
Bloomora Catalog App - Serializers
"""
from rest_framework import serializers
from .models import Category, Product, Occasion


class CategorySerializer(serializers.ModelSerializer):
    """Matches Bloomora API.yaml Category schema."""
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'image', 'icon', 'slug', 'active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class OccasionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Occasion
        fields = ['id', 'name', 'slug', 'description', 'emoji', 'active']


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for product lists."""
    seller_name = serializers.ReadOnlyField()
    category_name = serializers.ReadOnlyField()
    in_stock = serializers.ReadOnlyField()
    average_rating = serializers.ReadOnlyField()
    review_count = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            'id', 'seller', 'seller_name', 'category', 'category_name',
            'name', 'subtitle', 'description', 'price', 'original_price',
            'stock', 'images', 'tags', 'customizable', 'location', 'active',
            'featured', 'is_best_seller', 'is_trending', 'emotions',
            'recipient_types', 'budget_tier', 'same_day_available',
            'delivery_time_hours', 'in_stock', 'average_rating', 'review_count',
            'ai_recommendation_reason', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'seller', 'seller_name', 'category_name', 'created_at', 'updated_at']


class ProductDetailSerializer(ProductListSerializer):
    """Full product detail serializer."""
    occasions = OccasionSerializer(many=True, read_only=True)

    class Meta(ProductListSerializer.Meta):
        fields = ProductListSerializer.Meta.fields + [
            'story', 'occasions', 'interests', 'supports_photo_customization',
            'supports_text_customization', 'personalization_fields',
            'delivery_area', 'preparation_time_minutes',
        ]


class ProductWriteSerializer(serializers.ModelSerializer):
    """For creating/updating products (seller/admin)."""
    class Meta:
        model = Product
        fields = [
            'category', 'name', 'subtitle', 'description', 'price', 'original_price',
            'stock', 'images', 'tags', 'customizable', 'location', 'active', 'featured',
            'story', 'emotions', 'recipient_types', 'budget_tier', 'interests',
            'supports_photo_customization', 'supports_text_customization',
            'personalization_fields', 'same_day_available', 'delivery_time_hours',
            'delivery_area', 'preparation_time_minutes', 'ai_recommendation_reason',
        ]

    def create(self, validated_data):
        validated_data['seller'] = self.context['request'].user.seller_profile
        return super().create(validated_data)
