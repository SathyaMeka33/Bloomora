"""
Bloomora Orders App - Views
"""
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderCreateSerializer
from apps.accounts.models import Address


class OrderListCreateView(APIView):
    """GET/POST /api/orders/ - matches YAML."""

    def get(self, request):
        orders = Order.objects.filter(user=request.user).prefetch_related('items')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Create order from current cart."""
        from apps.cart.models import Cart, CartItem
        
        cart = Cart.objects.filter(user=request.user).first()
        if not cart or not cart.items.exists():
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        # Get address snapshot
        address_id = request.data.get('address_id')
        address_snapshot = {}
        if address_id:
            try:
                addr = Address.objects.get(id=address_id, user=request.user)
                address_snapshot = {
                    'full_name': addr.full_name,
                    'phone': addr.phone,
                    'address_line1': addr.address_line1,
                    'address_line2': addr.address_line2,
                    'city': addr.city,
                    'state': addr.state,
                    'pincode': addr.pincode,
                }
            except Address.DoesNotExist:
                pass

        # Create order
        order = Order.objects.create(
            user=request.user,
            total=cart.total,
            address_snapshot=address_snapshot,
            gift_message=request.data.get('gift_message', ''),
            delivery_date=request.data.get('delivery_date'),
        )

        # Create order items from cart
        for cart_item in cart.items.select_related('product'):
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                quantity=cart_item.quantity,
                price_snapshot=cart_item.unit_price_snapshot,
                product_name=cart_item.product.name,
                product_snapshot={
                    'name': cart_item.product.name,
                    'price': str(cart_item.product.price),
                    'images': cart_item.product.images,
                },
                personalization=cart_item.personalization,
                gift_message=cart_item.gift_message,
                packaging=cart_item.packaging,
            )

        # Clear cart
        cart.items.all().delete()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderDetailView(generics.RetrieveAPIView):
    """GET /api/orders/{id}/ - matches YAML."""
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')


class OrderStatusView(APIView):
    """PATCH /api/orders/{id}/status/ - matches YAML."""
    def patch(self, request, pk):
        try:
            order = Order.objects.get(id=pk)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Check permission
        user = request.user
        if user.role not in ('admin', 'seller') and order.user != user:
            return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

        new_status = request.data.get('status')
        if new_status in dict(Order.STATUS_CHOICES):
            order.status = new_status
            order.save()
        return Response(OrderSerializer(order).data)


class OrderHistoryView(generics.ListAPIView):
    """GET /api/orders/history/ - matches YAML."""
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(
            user=self.request.user, status='delivered'
        ).prefetch_related('items').order_by('-created_at')
