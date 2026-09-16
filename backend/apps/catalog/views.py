"""
Bloomora Catalog App - Views
"""
from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as df
from .models import Category, Product
from .serializers import (
    CategorySerializer, ProductListSerializer,
    ProductDetailSerializer, ProductWriteSerializer
)
from apps.accounts.models import User


class IsSeller(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role in ('seller', 'admin')


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role == 'admin'


class ProductFilter(df.FilterSet):
    min_price = df.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = df.NumberFilter(field_name='price', lookup_expr='lte')
    emotion = df.CharFilter(method='filter_emotion')
    recipient = df.CharFilter(field_name='recipient_types', lookup_expr='icontains')
    customizable = df.BooleanFilter(field_name='customizable')
    same_day = df.BooleanFilter(field_name='same_day_available')
    location = df.CharFilter(field_name='location', lookup_expr='icontains')

    # Taxonomy filters (by slug)
    gift_type = df.CharFilter(method='filter_gift_type')
    occasion_type = df.CharFilter(method='filter_occasion_type')
    recipient_tag = df.CharFilter(method='filter_recipient_tag')
    gift_intent = df.CharFilter(method='filter_gift_intent')

    def filter_emotion(self, queryset, name, value):
        return queryset.filter(emotions__icontains=value)

    def filter_gift_type(self, queryset, name, value):
        """Filter by gift type slug OR its parent slug."""
        from apps.taxonomy.models import GiftType
        try:
            gt = GiftType.objects.get(slug=value)
            # Include products tagged with this type OR any of its subcategories
            gt_ids = list(gt.subcategories.values_list('id', flat=True)) + [gt.id]
            return queryset.filter(gift_types__in=gt_ids).distinct()
        except GiftType.DoesNotExist:
            return queryset.none()

    def filter_occasion_type(self, queryset, name, value):
        """Filter by occasion type slug OR its parent slug."""
        from apps.taxonomy.models import OccasionType
        try:
            ot = OccasionType.objects.get(slug=value)
            ot_ids = list(ot.subcategories.values_list('id', flat=True)) + [ot.id]
            return queryset.filter(occasion_types__in=ot_ids).distinct()
        except OccasionType.DoesNotExist:
            # Fallback: also check legacy occasions field by slug
            return queryset.filter(occasions__slug=value).distinct()

    def filter_recipient_tag(self, queryset, name, value):
        from apps.taxonomy.models import RecipientType
        return queryset.filter(recipient_type_tags__slug=value).distinct()

    def filter_gift_intent(self, queryset, name, value):
        from apps.taxonomy.models import GiftIntentTag
        return queryset.filter(gift_intent_tags__slug=value).distinct()

    class Meta:
        model = Product
        fields = ['category', 'active', 'featured', 'is_best_seller', 'is_trending']


class CategoryListCreateView(generics.ListCreateAPIView):
    """GET/POST /api/categories/ - matches YAML."""
    queryset = Category.objects.filter(active=True)
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']


class ProductListCreateView(generics.ListCreateAPIView):
    """GET/POST /api/products/ - matches YAML."""
    permission_classes = [IsSeller]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description', 'subtitle', 'tags']
    ordering_fields = ['price', 'created_at', 'average_rating']
    ordering = ['-featured', '-created_at']

    def get_queryset(self):
        return Product.objects.filter(active=True).select_related('seller', 'category')

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProductWriteSerializer
        return ProductListSerializer


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET/PUT/PATCH/DELETE /api/products/{id}/ - matches YAML."""
    queryset = Product.objects.select_related('seller', 'category').prefetch_related('occasions', 'reviews')
    permission_classes = [IsSeller]

    def get_serializer_class(self):
        if self.request.method in ('PUT', 'PATCH'):
            return ProductWriteSerializer
        return ProductDetailSerializer

    def get_permissions(self):
        if self.request.method in ('PUT', 'PATCH', 'DELETE'):
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]
