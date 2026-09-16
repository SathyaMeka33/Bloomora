from django.contrib import admin
from .models import Seller, SellerVerification


@admin.register(Seller)
class SellerAdmin(admin.ModelAdmin):
    list_display = ['business_name', 'user', 'location', 'approved', 'rating', 'total_orders']
    list_filter = ['approved', 'handmade', 'supports_same_day']
    search_fields = ['business_name', 'user__email', 'location']
    list_editable = ['approved']


@admin.register(SellerVerification)
class SellerVerificationAdmin(admin.ModelAdmin):
    list_display = ['seller', 'status', 'verified_at']
    list_filter = ['status']
