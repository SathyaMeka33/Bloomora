from django.urls import path
from . import views

urlpatterns = [
    path('', views.SellerListView.as_view(), name='sellers-list'),
    path('<int:pk>/', views.SellerDetailView.as_view(), name='seller-detail'),
    path('products/', views.SellerProductsView.as_view(), name='seller-my-products'),
]
