"""
Bloomora Payments App - Views
Razorpay integration with secure server-side verification
"""
import hmac
import hashlib
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Payment
from apps.orders.models import Order


class CreateRazorpayOrderView(APIView):
    """POST /api/payments/create-order/ - Create Razorpay order."""

    def post(self, request):
        order_id = request.data.get('order_id')
        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

        amount_paise = int(order.total * 100)  # Razorpay uses paise

        if settings.RAZORPAY_KEY_ID:
            try:
                import razorpay
                client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
                razorpay_order = client.order.create({
                    'amount': amount_paise,
                    'currency': 'INR',
                    'notes': {
                        'bloomora_order_id': str(order_id),
                        'user_email': request.user.email,
                    }
                })
                payment, _ = Payment.objects.get_or_create(
                    order=order,
                    defaults={'amount': order.total}
                )
                payment.razorpay_order_id = razorpay_order['id']
                payment.save()
                return Response({
                    'razorpay_order_id': razorpay_order['id'],
                    'razorpay_key_id': settings.RAZORPAY_KEY_ID,
                    'amount': amount_paise,
                    'currency': 'INR',
                    'order_id': order_id,
                })
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Mock response for development (no Razorpay key)
        mock_order_id = f"order_mock_{order_id}_{request.user.id}"
        payment, _ = Payment.objects.get_or_create(
            order=order,
            defaults={'amount': order.total}
        )
        payment.razorpay_order_id = mock_order_id
        payment.save()
        return Response({
            'razorpay_order_id': mock_order_id,
            'razorpay_key_id': 'rzp_test_mock',
            'amount': amount_paise,
            'currency': 'INR',
            'order_id': order_id,
            'mock': True,
        })


class VerifyPaymentView(APIView):
    """POST /api/payments/verify/ - Verify Razorpay payment signature."""

    def post(self, request):
        razorpay_order_id = request.data.get('razorpay_order_id', '')
        razorpay_payment_id = request.data.get('razorpay_payment_id', '')
        razorpay_signature = request.data.get('razorpay_signature', '')
        order_id = request.data.get('order_id')

        try:
            payment = Payment.objects.get(razorpay_order_id=razorpay_order_id)
            order = payment.order
        except Payment.DoesNotExist:
            return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)

        # Verify signature if Razorpay is configured
        if settings.RAZORPAY_KEY_SECRET and not razorpay_order_id.startswith('order_mock_'):
            message = f"{razorpay_order_id}|{razorpay_payment_id}"
            expected = hmac.new(
                settings.RAZORPAY_KEY_SECRET.encode(),
                message.encode(),
                hashlib.sha256
            ).hexdigest()
            if expected != razorpay_signature:
                return Response({'error': 'Invalid signature'}, status=status.HTTP_400_BAD_REQUEST)

        # Update payment and order
        payment.razorpay_payment_id = razorpay_payment_id
        payment.razorpay_signature = razorpay_signature
        payment.status = 'success'
        payment.save()

        order.status = 'paid'
        order.payment_status = 'paid'
        order.save()

        return Response({'success': True, 'order_id': order.id})


class WebhookView(APIView):
    """POST /api/payments/webhook/ - Razorpay webhook handler."""
    permission_classes = []  # No auth for webhooks

    def post(self, request):
        # Verify webhook signature
        webhook_secret = settings.RAZORPAY_KEY_SECRET
        received_signature = request.headers.get('X-Razorpay-Signature', '')
        payload = request.body

        if webhook_secret:
            expected = hmac.new(webhook_secret.encode(), payload, hashlib.sha256).hexdigest()
            if expected != received_signature:
                return Response({'error': 'Invalid webhook signature'}, status=400)

        event = request.data.get('event', '')
        if event == 'payment.captured':
            payment_id = request.data.get('payload', {}).get('payment', {}).get('entity', {}).get('id')
            try:
                payment = Payment.objects.get(razorpay_payment_id=payment_id)
                payment.status = 'success'
                payment.save()
                payment.order.status = 'paid'
                payment.order.payment_status = 'paid'
                payment.order.save()
            except Payment.DoesNotExist:
                pass

        return Response({'status': 'ok'})
