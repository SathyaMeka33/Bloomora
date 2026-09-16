"""
Bloomora Taxonomy App — Models
GiftType, OccasionType, RecipientType, GiftIntentTag

Extends the existing Category/Occasion in catalog app by providing:
- Hierarchical gift type tree (GiftType → Subcategories)
- Hierarchical occasion tree (OccasionType → Subcategories)
- Recipient profiles
- AI intent tags
"""
from django.db import models
from django.db.models import Index


class GiftType(models.Model):
    """
    What kind of gift it is.
    e.g. Flowers > Bouquets > Rose Bouquets
    """
    name = models.CharField(max_length=150)
    slug = models.SlugField(unique=True, db_index=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=100, blank=True)       # emoji or icon name
    image = models.URLField(blank=True)
    parent = models.ForeignKey(
        'self', null=True, blank=True,
        on_delete=models.CASCADE, related_name='subcategories'
    )
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True, db_index=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'bloomora_gift_types'
        ordering = ['display_order', 'name']
        indexes = [
            Index(fields=['slug']),
            Index(fields=['parent', 'is_active']),
            Index(fields=['display_order']),
            Index(fields=['is_featured', 'is_active']),
        ]

    def __str__(self):
        if self.parent:
            return f'{self.parent.name} › {self.name}'
        return self.name

    @property
    def is_root(self):
        return self.parent_id is None

    @property
    def full_path(self):
        if self.parent:
            return f'{self.parent.full_path} / {self.name}'
        return self.name


class OccasionType(models.Model):
    """
    Why/when the gift is given.
    e.g. Birthdays > Milestone Birthday > 30th Birthday
    """
    name = models.CharField(max_length=150)
    slug = models.SlugField(unique=True, db_index=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=100, blank=True)
    emoji = models.CharField(max_length=10, blank=True)
    image = models.URLField(blank=True)
    parent = models.ForeignKey(
        'self', null=True, blank=True,
        on_delete=models.CASCADE, related_name='subcategories'
    )
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True, db_index=True)
    is_featured = models.BooleanField(default=False)
    # Seasonal support (for Diwali, Christmas etc.)
    is_seasonal = models.BooleanField(default=False)
    season_start = models.DateField(null=True, blank=True)    # e.g. Oct 20
    season_end = models.DateField(null=True, blank=True)      # e.g. Nov 20
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'bloomora_occasion_types'
        ordering = ['display_order', 'name']
        indexes = [
            Index(fields=['slug']),
            Index(fields=['parent', 'is_active']),
            Index(fields=['is_featured', 'is_active']),
        ]

    def __str__(self):
        if self.parent:
            return f'{self.parent.name} › {self.name}'
        return self.name


class RecipientType(models.Model):
    """
    Who receives the gift.
    e.g. Partner, Mother, Best Friend, Colleague
    """
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, db_index=True)
    emoji = models.CharField(max_length=10, blank=True)
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'bloomora_recipient_types'
        ordering = ['display_order', 'name']

    def __str__(self):
        return self.name


class GiftIntentTag(models.Model):
    """
    The emotional intent / feeling behind the gift.
    e.g. Romantic, Sentimental, Luxury, Budget-Friendly
    These are AI-facing metadata tags, not necessarily shown directly to customers.
    """
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, db_index=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'bloomora_gift_intent_tags'
        ordering = ['name']

    def __str__(self):
        return self.name
