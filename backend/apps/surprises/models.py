"""
Bloomora Surprises App - Models
"""
from django.db import models


class SurprisePackage(models.Model):
    """Surprise gift package."""
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("planning", "Planning"),
        ("confirmed", "Confirmed"),
        ("preparing", "Preparing"),
        ("dispatched", "Dispatched"),
        ("delivered", "Delivered"),
    ]
    user = models.ForeignKey("accounts.User", on_delete=models.CASCADE, related_name="surprises")
    recipient_name = models.CharField(max_length=100)
    recipient_phone = models.CharField(max_length=15, blank=True)
    occasion = models.CharField(max_length=100)
    emotion = models.CharField(max_length=50, blank=True)
    budget = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    delivery_date = models.DateField(null=True, blank=True)
    delivery_address = models.JSONField(default=dict)
    products = models.ManyToManyField("catalog.Product", blank=True)
    gift_message = models.TextField(blank=True)
    packaging_instructions = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    # Surprise Planner extended fields
    event_type = models.CharField(max_length=50, blank=True)
    location = models.CharField(max_length=200, blank=True)
    cake_description = models.CharField(max_length=200, blank=True)
    flowers_description = models.CharField(max_length=200, blank=True)
    decorations_description = models.CharField(max_length=200, blank=True)
    food_description = models.CharField(max_length=200, blank=True)
    notes = models.TextField(blank=True)
    total = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "bloomora_surprises"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Surprise for {self.recipient_name} ({self.occasion})"
