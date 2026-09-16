"""
Bloomora Creators App - Views
"""
from rest_framework import generics, permissions
from .models import Seller
from .serializers import SellerSerializer, SellerPublicSerializer
from apps.catalog.models import Product
from apps.catalog.serializers import ProductListSerializer, ProductWriteSerializer


class IsSeller(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ('seller', 'admin')


class SellerMeView(generics.RetrieveUpdateAPIView):
    """GET/PUT/PATCH /api/seller/me/ - matches YAML."""
    serializer_class = SellerSerializer
    permission_classes = [IsSeller]

    def get_object(self):
        seller, created = Seller.objects.get_or_create(
            user=self.request.user,
            defaults={'business_name': f"{self.request.user.full_name}'s Store"}
        )
        return seller


class SellerListView(generics.ListAPIView):
    """GET /api/sellers/ - Public seller discovery."""
    queryset = Seller.objects.filter(approved=True).select_related('user')
    serializer_class = SellerPublicSerializer
    permission_classes = [permissions.AllowAny]


class SellerDetailView(generics.RetrieveAPIView):
    """GET /api/sellers/{id}/ - Public seller profile."""
    queryset = Seller.objects.filter(approved=True)
    serializer_class = SellerPublicSerializer
    permission_classes = [permissions.AllowAny]


class SellerProductsView(generics.ListCreateAPIView):
    """GET/POST /api/sellers/products/ - Seller product management."""
    permission_classes = [IsSeller]

    def get_queryset(self):
        return Product.objects.filter(seller__user=self.request.user)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProductWriteSerializer
        return ProductListSerializer
