from django.db import models

class AnalyticsEvent(models.Model):
    EVENT_TYPES = [
        ("gift_finder_started", "Gift Finder Started"),
        ("gift_finder_completed", "Gift Finder Completed"),
        ("recommendation_shown", "Recommendation Shown"),
        ("recommendation_clicked", "Recommendation Clicked"),
        ("product_viewed", "Product Viewed"),
        ("wishlist_added", "Wishlist Added"),
        ("cart_added", "Cart Added"),
        ("checkout_started", "Checkout Started"),
        ("order_placed", "Order Placed"),
        ("payment_success", "Payment Success"),
        ("review_submitted", "Review Submitted"),
    ]
    user = models.ForeignKey("accounts.User", on_delete=models.SET_NULL, null=True, blank=True)
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES)
    data = models.JSONField(default=dict)
    session_id = models.CharField(max_length=100, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "bloomora_analytics"
        indexes = [models.Index(fields=["event_type", "created_at"])]
