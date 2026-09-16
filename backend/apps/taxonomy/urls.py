from django.urls import path
from . import views

urlpatterns = [
    path('', views.TaxonomyView.as_view(), name='taxonomy'),
    path('gift-types/', views.GiftTypeListView.as_view(), name='gift-types-list'),
    path('gift-types/<int:pk>/subcategories/', views.GiftTypeSubcategoryView.as_view(), name='gift-type-subcategories'),
    path('occasion-types/', views.OccasionTypeListView.as_view(), name='occasion-types-list'),
    path('occasion-types/<int:pk>/subcategories/', views.OccasionTypeSubcategoryView.as_view(), name='occasion-type-subcategories'),
    path('recipient-types/', views.RecipientTypeListView.as_view(), name='recipient-types-list'),
    path('gift-intents/', views.GiftIntentListView.as_view(), name='gift-intents-list'),
]
