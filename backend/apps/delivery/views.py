from rest_framework.views import APIView
from rest_framework.response import Response
class DeliveryTrackingView(APIView):
    def get(self, request, order_id):
        from .models import DeliveryTracking
        try:
            tracking = DeliveryTracking.objects.get(order_id=order_id, order__user=request.user)
            return Response({'tracking_id': tracking.tracking_id, 'status': tracking.status, 'updates': tracking.updates, 'estimated_delivery': tracking.estimated_delivery})
        except DeliveryTracking.DoesNotExist:
            return Response({'status': 'No tracking available'})
