"""
Bloomora Cart App - Models
"""
from django.db import models
from decimal import Decimal


class Cart(models.Model):
    """Shopping cart - matches Bloomora API.yaml Cart schema."""
    user = models.OneToOneField('accounts.User', on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'bloomora_carts'

    def __str__(self):
        return f"Cart({self.user.email})"

    @property
    def total(self):
        return sum(item.line_total for item in self.items.all())


class CartItem(models.Model):
    """Cart item - matches Bloomora API.yaml CartItem schema."""
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('catalog.Product', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    unit_price_snapshot = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Extended fields
    personalization = models.JSONField(default=dict, blank=True)  # Custom fields
    gift_message = models.TextField(blank=True)
    packaging = models.CharField(max_length=100, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'bloomora_cart_items'
        unique_together = ['cart', 'product']

    def __str__(self):
        return f"{self.product.name} x{self.quantity}"

    @property
    def product_name(self):
        return self.product.name

    @property
    def line_total(self):
        return self.unit_price_snapshot * self.quantity

    def save(self, *args, **kwargs):
        # Snapshot current price on first save
        if not self.unit_price_snapshot:
            self.unit_price_snapshot = self.product.price
        super().save(*args, **kwargs)
