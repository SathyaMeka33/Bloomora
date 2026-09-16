from django.db import models

class DeliveryPartner(models.Model):
    name = models.CharField(max_length=100)
    api_key = models.CharField(max_length=255, blank=True)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "bloomora_delivery_partners"

    def __str__(self):
        return self.name

class DeliveryTracking(models.Model):
    order = models.OneToOneField("orders.Order", on_delete=models.CASCADE, related_name="tracking")
    partner = models.ForeignKey(DeliveryPartner, on_delete=models.SET_NULL, null=True)
    tracking_id = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=50, blank=True)
    location = models.CharField(max_length=200, blank=True)
    estimated_delivery = models.DateTimeField(null=True, blank=True)
    updates = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "bloomora_delivery_tracking"
