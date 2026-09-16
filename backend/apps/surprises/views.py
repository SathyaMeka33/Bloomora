from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import SurprisePackage
from .serializers import SurpriseSerializer


class SurpriseCreateView(APIView):
    """POST /api/surprises/ - matches YAML."""
    def post(self, request):
        serializer = SurpriseSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        surprise = serializer.save()
        return Response(SurpriseSerializer(surprise).data, status=status.HTTP_201_CREATED)


class SurpriseDetailView(APIView):
    """GET/POST /api/surprises/{id}/ - matches YAML."""
    def get(self, request, pk):
        try:
            surprise = SurprisePackage.objects.get(id=pk, user=request.user)
            return Response(SurpriseSerializer(surprise).data)
        except SurprisePackage.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def post(self, request, pk):
        """Update surprise (add products, update details)."""
        try:
            surprise = SurprisePackage.objects.get(id=pk, user=request.user)
            serializer = SurpriseSerializer(surprise, data=request.data, partial=True, context={"request": request})
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        except SurprisePackage.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


class SurpriseCheckoutView(APIView):
    """GET/POST /api/surprises/{id}/checkout/ - matches YAML."""
    def get(self, request, pk):
        try:
            surprise = SurprisePackage.objects.get(id=pk, user=request.user)
            return Response({
                "surprise": SurpriseSerializer(surprise).data,
                "summary": {
                    "total": str(surprise.total or surprise.budget or 0),
                    "delivery_date": str(surprise.delivery_date),
                    "status": surprise.status,
                }
            })
        except SurprisePackage.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def post(self, request, pk):
        """Confirm/place surprise order."""
        try:
            surprise = SurprisePackage.objects.get(id=pk, user=request.user)
            surprise.status = "confirmed"
            surprise.save()
            return Response({"message": "Surprise order confirmed!", "id": surprise.id})
        except SurprisePackage.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
