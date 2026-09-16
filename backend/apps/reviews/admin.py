from django.contrib import admin
from .models import Review, Feedback

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['product', 'user', 'rating', 'created_at']
    list_filter = ['rating']
    search_fields = ['product__name', 'user__email']

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ['rating', 'message', 'created_at']
    list_filter = ['rating']
