"""
Bloomora Orders App - Models
"""
from django.db import models


class Order(models.Model):
    """Order - matches Bloomora API.yaml Order schema."""
    STATUS_CHOICES = [
        ('pending_payment', 'Pending Payment'),
        ('paid', 'Paid'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('out_for_delivery', 'Out for Delivery'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
        ('failed', 'Failed'),
    ]
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]

    user = models.ForeignKey('accounts.User', on_delete=models.PROTECT, related_name='orders')
    total = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending_payment')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    
    # Snapshots at order time
    address_snapshot = models.JSONField(default=dict)
    
    # Extended fields
    gift_message = models.TextField(blank=True)
    delivery_date = models.DateField(null=True, blank=True)
    tracking_number = models.CharField(max_length=100, blank=True)
    delivery_partner = models.ForeignKey(
        'delivery.DeliveryPartner', on_delete=models.SET_NULL, null=True, blank=True
    )
    
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'bloomora_orders'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"Order #{self.id} ({self.user.email}) - {self.status}"


class OrderItem(models.Model):
    """Order item - matches Bloomora API.yaml OrderItem schema."""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('catalog.Product', on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    price_snapshot = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Snapshots
    product_name = models.CharField(max_length=200)  # Snapshot of product name
    product_snapshot = models.JSONField(default=dict)  # Full product snapshot
    
    # Personalization snapshot
    personalization = models.JSONField(default=dict)
    gift_message = models.TextField(blank=True)
    packaging = models.CharField(max_length=100, blank=True)

    class Meta:
        db_table = 'bloomora_order_items'

    def __str__(self):
        return f"{self.product_name} x{self.quantity}"

    @property
    def line_total(self):
        return self.price_snapshot * self.quantity
