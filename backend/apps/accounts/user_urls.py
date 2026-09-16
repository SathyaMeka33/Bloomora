"""
Bloomora Accounts App - User URLs (addresses, etc.)
"""
from django.urls import path
from . import views

urlpatterns = [
    path('me/', views.MeView.as_view(), name='user-me'),
    path('addresses/', views.AddressListCreateView.as_view(), name='user-addresses'),
    path('addresses/<int:pk>/', views.AddressDetailView.as_view(), name='user-address-detail'),
]
