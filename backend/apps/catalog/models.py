"""
Bloomora Catalog App - Models
Categories, Products, ProductImages, Occasions
"""
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class Category(models.Model):
    """Product category - matches Bloomora API.yaml Category schema."""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    image = models.URLField(null=True, blank=True)
    icon = models.CharField(max_length=50, blank=True)  # Lucide icon name
    slug = models.SlugField(unique=True)
    active = models.BooleanField(default=True)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'bloomora_categories'
        ordering = ['sort_order', 'name']

    def __str__(self):
        return self.name


class Occasion(models.Model):
    """Gift occasions (birthday, anniversary, etc.)."""
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    emoji = models.CharField(max_length=10, blank=True)
    active = models.BooleanField(default=True)

    class Meta:
        db_table = 'bloomora_occasions'
        ordering = ['name']

    def __str__(self):
        return self.name


class Product(models.Model):
    """
    Product model - matches Bloomora API.yaml Product schema.
    Extended with AI-specific fields for Gift Intelligence Engine.
    """
    # Core fields (from YAML)
    seller = models.ForeignKey(
        'creators.Seller', on_delete=models.CASCADE, related_name='products'
    )
    category = models.ForeignKey(
        Category, on_delete=models.PROTECT, related_name='products'
    )
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    images = models.JSONField(default=list)  # List of image URLs
    tags = models.JSONField(default=list)    # List of string tags
    customizable = models.BooleanField(default=False)
    location = models.CharField(max_length=150, blank=True)
    active = models.BooleanField(default=True)
    featured = models.BooleanField(default=False)

    # Extended fields for AI Gift Intelligence
    subtitle = models.CharField(max_length=255, blank=True)
    story = models.TextField(blank=True)         # Creator/product story
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Gifting Intelligence
    occasions = models.ManyToManyField(Occasion, blank=True, related_name='products')
    emotions = models.JSONField(default=list)         # ['love', 'appreciation', 'surprise']
    recipient_types = models.JSONField(default=list)  # ['for-her', 'for-mom', 'for-friends']
    interests = models.JSONField(default=list)        # ['books', 'coffee', 'plants']
    budget_tier = models.CharField(max_length=20, blank=True)  # 'under-199', '200-299', etc.

    # === TAXONOMY RELATIONSHIPS ===
    gift_types = models.ManyToManyField(
        'taxonomy.GiftType', blank=True, related_name='products'
    )
    occasion_types = models.ManyToManyField(
        'taxonomy.OccasionType', blank=True, related_name='products'
    )
    recipient_type_tags = models.ManyToManyField(
        'taxonomy.RecipientType', blank=True, related_name='products'
    )
    gift_intent_tags = models.ManyToManyField(
        'taxonomy.GiftIntentTag', blank=True, related_name='products'
    )
    
    # Personalization
    supports_photo_customization = models.BooleanField(default=False)
    supports_text_customization = models.BooleanField(default=False)
    personalization_fields = models.JSONField(default=list)  # Field definitions
    
    # Delivery
    same_day_available = models.BooleanField(default=False)
    delivery_time_hours = models.IntegerField(default=24)
    delivery_area = models.JSONField(default=list)  # List of city/area slugs
    preparation_time_minutes = models.IntegerField(default=30)
    
    # Marketplace
    is_best_seller = models.BooleanField(default=False)
    is_trending = models.BooleanField(default=False)
    is_seasonal = models.BooleanField(default=False)
    
    # AI
    ai_recommendation_reason = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'bloomora_products'
        ordering = ['-featured', '-is_best_seller', '-created_at']
        indexes = [
            models.Index(fields=['active', 'category']),
            models.Index(fields=['price']),
            models.Index(fields=['location']),
            models.Index(fields=['seller']),
        ]

    def __str__(self):
        return self.name

    @property
    def seller_name(self):
        return self.seller.business_name

    @property
    def category_name(self):
        return self.category.name

    @property
    def in_stock(self):
        return self.stock > 0

    @property
    def average_rating(self):
        reviews = self.reviews.all()
        if not reviews:
            return 0
        return round(sum(r.rating for r in reviews) / len(reviews), 2)

    @property
    def review_count(self):
        return self.reviews.count()
