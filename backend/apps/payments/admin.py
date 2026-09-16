from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'amount', 'status', 'razorpay_payment_id', 'created_at']
    list_filter = ['status', 'currency']
    search_fields = ['razorpay_order_id', 'razorpay_payment_id', 'order__user__email']
    readonly_fields = ['created_at', 'updated_at']
