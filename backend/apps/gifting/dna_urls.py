from django.urls import path
from . import views
urlpatterns = [
    path("", views.GiftDNAListCreateView.as_view(), name="gift-dna-list"),
    path("<int:pk>/", views.GiftDNADetailView.as_view(), name="gift-dna-detail"),
]
