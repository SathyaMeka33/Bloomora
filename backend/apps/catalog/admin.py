from django.contrib import admin
from .models import Category, Product, Occasion


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'active', 'sort_order']
    list_editable = ['active', 'sort_order']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Occasion)
class OccasionAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'emoji', 'active']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'seller', 'category', 'price', 'stock', 'active', 'featured', 'is_best_seller']
    list_filter = ['active', 'featured', 'category', 'customizable', 'same_day_available']
    search_fields = ['name', 'description', 'seller__business_name']
    list_editable = ['active', 'featured', 'price', 'stock']
    raw_id_fields = ['seller', 'category']
