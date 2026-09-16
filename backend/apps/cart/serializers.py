"""
Bloomora Cart App - Serializers
"""
from rest_framework import serializers
from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    """Matches Bloomora API.yaml CartItem schema."""
    product_name = serializers.ReadOnlyField()
    unit_price_snapshot = serializers.ReadOnlyField()
    line_total = serializers.ReadOnlyField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_name', 'quantity', 'unit_price_snapshot',
                  'line_total', 'personalization', 'gift_message', 'packaging']
        read_only_fields = ['id', 'product_name', 'unit_price_snapshot', 'line_total']


class CartSerializer(serializers.ModelSerializer):
    """Matches Bloomora API.yaml Cart schema."""
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.ReadOnlyField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total', 'created_at', 'updated_at']
        read_only_fields = ['id', 'total', 'created_at', 'updated_at']
