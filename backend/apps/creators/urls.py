from django.urls import path
from . import views

urlpatterns = [
    path('me/', views.SellerMeView.as_view(), name='seller-me'),
    path('products/', views.SellerProductsView.as_view(), name='seller-products'),
]
