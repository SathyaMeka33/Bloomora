"""
Bloomora Backend — Root URL Configuration
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns = [
    # Django Admin
    path('admin/', admin.site.urls),

    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    # Authentication (matches Bloomora API.yaml)
    path('api/auth/', include('apps.accounts.urls')),
    path('auth/', include('apps.accounts.urls')),  # Backward compat from YAML

    # Users & Addresses
    path('api/users/', include('apps.accounts.user_urls')),

    # Catalog
    path('api/categories/', include('apps.catalog.category_urls')),
    path('api/products/', include('apps.catalog.product_urls')),

    # Creators / Sellers
    path('api/seller/', include('apps.creators.urls')),
    path('api/sellers/', include('apps.creators.seller_urls')),

    # Commerce
    path('api/cart/', include('apps.cart.urls')),
    path('api/orders/', include('apps.orders.urls')),
    path('api/payments/', include('apps.payments.urls')),

    # Gifting Intelligence
    path('api/gift-dna/', include('apps.gifting.dna_urls')),
    path('api/gift-memory/', include('apps.gifting.memory_urls')),
    path('api/recommendations/', include('apps.recommendations.urls')),
    path('api/wishlist/', include('apps.wishlist.urls')),
    path('api/reminders/', include('apps.reminders.urls')),

    # AI
    path('api/ai/', include('apps.ai.urls')),

    # Surprises
    path('api/surprises/', include('apps.surprises.urls')),

    # Engagement
    path('api/reviews/', include('apps.reviews.urls')),
    path('api/feedback/', include('apps.reviews.feedback_urls')),

    # Notifications
    path('api/notifications/', include('apps.notifications.urls')),

    # Analytics
    path('api/analytics/', include('apps.analytics.urls')),

    # Delivery
    path('api/delivery/', include('apps.delivery.urls')),

    # Taxonomy (Gift Types, Occasion Types, Recipients, Intents)
    path('api/taxonomy/', include('apps.taxonomy.urls')),
    path('api/gift-types/', include('apps.taxonomy.urls')),
    path('api/occasion-types/', include('apps.taxonomy.urls')),
    path('api/recipient-types/', include('apps.taxonomy.urls')),
    path('api/gift-intents/', include('apps.taxonomy.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
