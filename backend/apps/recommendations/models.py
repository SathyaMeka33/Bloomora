"""
Bloomora Recommendations App
Gift Intent + AI Recommendations + Gift Fit Score
"""
from django.db import models


class GiftIntent(models.Model):
    """Captures user intent for gift recommendation."""
    user = models.ForeignKey("accounts.User", on_delete=models.SET_NULL, null=True, blank=True)
    recipient_name = models.CharField(max_length=100, blank=True)
    relationship = models.CharField(max_length=50, blank=True)
    age = models.IntegerField(null=True, blank=True)
    occasion = models.CharField(max_length=100, blank=True)
    emotion = models.CharField(max_length=50, blank=True)  # 'loved', 'surprised', 'appreciated'
    interests = models.JSONField(default=list)
    personality = models.JSONField(default=list)
    budget_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    budget_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    location = models.CharField(max_length=100, blank=True)
    delivery_date = models.DateField(null=True, blank=True)
    urgency = models.CharField(max_length=20, blank=True)  # 'today', 'week', 'month'
    free_text = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "bloomora_gift_intents"
        ordering = ["-created_at"]


class Recommendation(models.Model):
    """AI-generated gift recommendation with fit score."""
    intent = models.ForeignKey(GiftIntent, on_delete=models.CASCADE, related_name="recommendations")
    product = models.ForeignKey("catalog.Product", on_delete=models.CASCADE)
    fit_score = models.IntegerField(default=0)          # 0-100
    confidence = models.FloatField(default=0.0)         # 0.0-1.0
    why_this_gift = models.TextField(blank=True)        # AI explanation
    rank = models.IntegerField(default=1)               # Position in recommendations list
    creator_capability_match = models.BooleanField(default=True)
    delivery_estimate = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "bloomora_recommendations"
        ordering = ["-fit_score"]
