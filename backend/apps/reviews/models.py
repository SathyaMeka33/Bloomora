"""
Bloomora Reviews App - Models
"""
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class Review(models.Model):
    """Product review - matches Bloomora API.yaml Review schema."""
    product = models.ForeignKey('catalog.Product', on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='reviews')
    order = models.ForeignKey('orders.Order', on_delete=models.SET_NULL, null=True, blank=True)
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField(blank=True)
    images = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'bloomora_reviews'
        unique_together = ['product', 'user']
        ordering = ['-created_at']

    def __str__(self):
        return f"Review by {self.user.email} for {self.product.name}: {self.rating}/5"


class Feedback(models.Model):
    """Platform feedback - matches Bloomora API.yaml Feedback schema."""
    user = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True, blank=True)
    rating = models.PositiveSmallIntegerField(null=True, blank=True)
    message = models.TextField()
    page = models.CharField(max_length=100, blank=True)  # Which page was feedback from
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'bloomora_feedback'
        ordering = ['-created_at']

    def __str__(self):
        return f"Feedback: {self.message[:50]}"
