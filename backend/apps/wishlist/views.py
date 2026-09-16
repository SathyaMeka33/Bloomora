from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Wishlist
from apps.catalog.serializers import ProductListSerializer
from apps.catalog.models import Product

class WishlistView(APIView):
    """GET /api/wishlist/ and POST /api/wishlist/"""
    def get(self, request):
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        products = wishlist.products.all()
        return Response({"products": ProductListSerializer(products, many=True).data})

    def post(self, request):
        """Add product to wishlist."""
        product_id = request.data.get("product_id")
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        try:
            product = Product.objects.get(id=product_id)
            wishlist.products.add(product)
            return Response({"message": "Added to wishlist"})
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)


class WishlistItemView(APIView):
    """DELETE /api/wishlist/{product_id}/"""
    def delete(self, request, product_id):
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        wishlist.products.remove(product_id)
        return Response(status=status.HTTP_204_NO_CONTENT)
