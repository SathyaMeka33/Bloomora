from django.db import models

class Notification(models.Model):
    TYPE_CHOICES = [
        ("order_confirmed", "Order Confirmed"),
        ("payment_success", "Payment Success"),
        ("order_processing", "Order Processing"),
        ("order_shipped", "Order Shipped"),
        ("order_delivered", "Order Delivered"),
        ("review_request", "Review Request"),
        ("reminder", "Occasion Reminder"),
        ("system", "System"),
    ]
    user = models.ForeignKey("accounts.User", on_delete=models.CASCADE, related_name="notifications")
    type = models.CharField(max_length=30, choices=TYPE_CHOICES, default="system")
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    data = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "bloomora_notifications"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} - {self.title}"
