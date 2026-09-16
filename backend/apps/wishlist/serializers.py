from rest_framework import serializers
from apps.catalog.serializers import ProductListSerializer

class WishlistSerializer(serializers.Serializer):
    products = ProductListSerializer(many=True, read_only=True)
