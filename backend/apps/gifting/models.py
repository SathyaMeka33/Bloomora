"""
Bloomora Gifting App - Models
Gift DNA, Gift Memory, Recipient Profiles
"""
from django.db import models


class RecipientProfile(models.Model):
    """Saved recipient for gift intelligence."""
    user = models.ForeignKey("accounts.User", on_delete=models.CASCADE, related_name="recipients")
    name = models.CharField(max_length=100)
    relationship = models.CharField(max_length=50)
    age = models.IntegerField(null=True, blank=True)
    city = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "bloomora_recipients"
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.relationship})"


class GiftDNA(models.Model):
    """
    Gift DNA - Deep recipient personality profile.
    Used by AI for superior gift recommendations.
    """
    recipient = models.OneToOneField(RecipientProfile, on_delete=models.CASCADE, related_name="gift_dna")
    interests = models.JSONField(default=list)         # ['books', 'coffee', 'plants']
    personality = models.JSONField(default=list)       # ['introvert', 'creative', 'practical']
    style = models.JSONField(default=list)             # ['minimalist', 'colorful', 'vintage']
    dislikes = models.JSONField(default=list)          # ['perfume', 'clothes']
    preferred_categories = models.JSONField(default=list)  # Category slugs
    favorite_colors = models.JSONField(default=list)
    favorite_chocolates = models.JSONField(default=list)
    notes = models.TextField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "bloomora_gift_dna"

    def __str__(self):
        return f"Gift DNA for {self.recipient.name}"


class GiftMemory(models.Model):
    """
    Gift Memory - Record of past gifts.
    Used by Anti-Repetition Engine.
    """
    user = models.ForeignKey("accounts.User", on_delete=models.CASCADE, related_name="gift_memories")
    recipient = models.ForeignKey(RecipientProfile, on_delete=models.CASCADE, related_name="gift_history")
    product = models.ForeignKey("catalog.Product", on_delete=models.SET_NULL, null=True, blank=True)
    product_name_snapshot = models.CharField(max_length=200)  # In case product is deleted
    category_snapshot = models.CharField(max_length=100, blank=True)
    occasion = models.CharField(max_length=100)
    gifted_at = models.DateField()
    rating = models.PositiveSmallIntegerField(null=True, blank=True)  # How much recipient liked it
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "bloomora_gift_memory"
        ordering = ["-gifted_at"]

    def __str__(self):
        return f"Gift: {self.product_name_snapshot} -> {self.recipient.name} ({self.occasion})"
