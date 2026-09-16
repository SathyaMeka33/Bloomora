# Wishlist App - models.py
from django.db import models

class Wishlist(models.Model):
    user = models.OneToOneField("accounts.User", on_delete=models.CASCADE, related_name="wishlist")
    products = models.ManyToManyField("catalog.Product", blank=True, related_name="wishlisted_by")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "bloomora_wishlists"

    def __str__(self):
        return f"Wishlist({self.user.email})"
