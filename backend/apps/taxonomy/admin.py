"""
Bloomora Taxonomy Admin
Full admin management of Gift Types, Occasion Types, Recipients, Intents.
"""
from django.contrib import admin
from .models import GiftType, OccasionType, RecipientType, GiftIntentTag


class GiftTypeSubcategoryInline(admin.TabularInline):
    model = GiftType
    fk_name = 'parent'
    extra = 1
    fields = ['name', 'slug', 'icon', 'display_order', 'is_active', 'is_featured']
    prepopulated_fields = {'slug': ('name',)}
    show_change_link = True


@admin.register(GiftType)
class GiftTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'icon', 'parent', 'display_order', 'is_active', 'is_featured']
    list_filter = ['is_active', 'is_featured', 'parent']
    list_editable = ['display_order', 'is_active', 'is_featured']
    search_fields = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['display_order', 'name']
    inlines = [GiftTypeSubcategoryInline]

    def get_queryset(self, request):
        return super().get_queryset(request).filter(parent__isnull=True)


class OccasionTypeSubcategoryInline(admin.TabularInline):
    model = OccasionType
    fk_name = 'parent'
    extra = 1
    fields = ['name', 'slug', 'emoji', 'display_order', 'is_active', 'is_featured', 'is_seasonal']
    prepopulated_fields = {'slug': ('name',)}
    show_change_link = True


@admin.register(OccasionType)
class OccasionTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'emoji', 'parent', 'display_order', 'is_active', 'is_featured', 'is_seasonal']
    list_filter = ['is_active', 'is_featured', 'is_seasonal', 'parent']
    list_editable = ['display_order', 'is_active', 'is_featured']
    search_fields = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['display_order', 'name']
    inlines = [OccasionTypeSubcategoryInline]

    def get_queryset(self, request):
        return super().get_queryset(request).filter(parent__isnull=True)


@admin.register(RecipientType)
class RecipientTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'emoji', 'display_order', 'is_active']
    list_editable = ['display_order', 'is_active']
    search_fields = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['display_order', 'name']


@admin.register(GiftIntentTag)
class GiftIntentTagAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'is_active']
    list_editable = ['is_active']
    search_fields = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['name']
