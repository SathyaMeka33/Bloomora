"""
Bloomora Creators App - Models
Seller profiles, capabilities, inventory
"""
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class Seller(models.Model):
    """
    Seller/Creator profile - matches Bloomora API.yaml Seller schema.
    Extended with creator marketplace fields.
    """
    user = models.OneToOneField(
        'accounts.User', on_delete=models.CASCADE, related_name='seller_profile'
    )
    business_name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=150, blank=True)
    approved = models.BooleanField(default=False)

    # Creator marketplace extensions
    creator_story = models.TextField(blank=True)
    handmade = models.BooleanField(default=False)
    profile_image = models.URLField(blank=True)
    banner_image = models.URLField(blank=True)

    # Capabilities
    supports_customization = models.BooleanField(default=False)
    supports_photo_customization = models.BooleanField(default=False)
    supports_text_customization = models.BooleanField(default=False)
    supports_gift_wrapping = models.BooleanField(default=False)
    supports_custom_orders = models.BooleanField(default=False)
    supports_same_day = models.BooleanField(default=False)
    lead_time_hours = models.IntegerField(default=24)
    delivery_radius_km = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)

    # Ratings
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    total_orders = models.IntegerField(default=0)
    total_reviews = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'bloomora_sellers'
        ordering = ['-rating', '-total_orders']

    def __str__(self):
        return self.business_name


class SellerVerification(models.Model):
    """Seller verification documents."""
    VERIFICATION_STATUS = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    seller = models.OneToOneField(Seller, on_delete=models.CASCADE, related_name='verification')
    status = models.CharField(max_length=20, choices=VERIFICATION_STATUS, default='pending')
    gst_number = models.CharField(max_length=20, blank=True)
    pan_number = models.CharField(max_length=10, blank=True)
    bank_account = models.CharField(max_length=20, blank=True)
    ifsc_code = models.CharField(max_length=11, blank=True)
    notes = models.TextField(blank=True)
    verified_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'bloomora_seller_verifications'
