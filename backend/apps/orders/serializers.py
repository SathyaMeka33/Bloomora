"""
Bloomora Orders App - Serializers
"""
from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    """Matches Bloomora API.yaml OrderItem schema."""
    product_name = serializers.ReadOnlyField()
    line_total = serializers.ReadOnlyField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price_snapshot',
                  'personalization', 'gift_message', 'packaging', 'line_total']
        read_only_fields = ['id', 'product_name', 'line_total']


class OrderSerializer(serializers.ModelSerializer):
    """Matches Bloomora API.yaml Order schema."""
    items = OrderItemSerializer(many=True, read_only=True)
    payment_status = serializers.ReadOnlyField()
    status = serializers.ReadOnlyField()

    class Meta:
        model = Order
        fields = [
            'id', 'total', 'address_snapshot', 'status', 'payment_status',
            'items', 'gift_message', 'delivery_date', 'tracking_number',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'total', 'status', 'payment_status', 'created_at', 'updated_at']


class OrderCreateSerializer(serializers.Serializer):
    """Create order from cart."""
    address_id = serializers.IntegerField(required=False)
    delivery_date = serializers.DateField(required=False)
    gift_message = serializers.CharField(required=False, allow_blank=True)
