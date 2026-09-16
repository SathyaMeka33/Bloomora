from django.contrib import admin
from .models import SurprisePackage
@admin.register(SurprisePackage)
class SurpriseAdmin(admin.ModelAdmin):
    list_display = ['recipient_name','occasion','status','delivery_date','total','created_at']
    list_filter = ['status','occasion']
