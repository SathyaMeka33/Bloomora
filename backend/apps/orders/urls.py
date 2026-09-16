from django.urls import path
from . import views

urlpatterns = [
    path('', views.OrderListCreateView.as_view(), name='order-list'),
    path('history/', views.OrderHistoryView.as_view(), name='order-history'),
    path('<int:pk>/', views.OrderDetailView.as_view(), name='order-detail'),
    path('<int:pk>/status/', views.OrderStatusView.as_view(), name='order-status'),
]
