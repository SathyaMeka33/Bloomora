"""
Bloomora Cart App - Views
"""
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer


class CartView(APIView):
    """GET /api/cart/ - matches YAML."""
    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)


class CartItemCreateView(APIView):
    """POST /api/cart/items/ - matches YAML."""
    def post(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product')
        quantity = int(request.data.get('quantity', 1))
        personalization = request.data.get('personalization', {})
        gift_message = request.data.get('gift_message', '')
        packaging = request.data.get('packaging', '')

        item, created = CartItem.objects.get_or_create(
            cart=cart, product_id=product_id,
            defaults={'quantity': quantity, 'personalization': personalization,
                      'gift_message': gift_message, 'packaging': packaging}
        )
        if not created:
            item.quantity += quantity
            item.save()

        return Response(CartSerializer(cart).data)


class CartItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    """PATCH/DELETE /api/cart/items/{id}/ - matches YAML."""
    serializer_class = CartItemSerializer

    def get_queryset(self):
        return CartItem.objects.filter(cart__user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
