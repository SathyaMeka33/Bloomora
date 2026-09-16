from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from .models import AnalyticsEvent

class AnalyticsEventView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        user = request.user if request.user.is_authenticated else None
        AnalyticsEvent.objects.create(user=user, event_type=request.data.get('event_type',''), data=request.data.get('data', {}))
        return Response({'status':'ok'})
