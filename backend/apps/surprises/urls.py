from django.urls import path
from . import views
urlpatterns = [
    path("", views.SurpriseCreateView.as_view(), name="surprise-create"),
    path("<int:pk>/", views.SurpriseDetailView.as_view(), name="surprise-detail"),
    path("<int:pk>/checkout/", views.SurpriseCheckoutView.as_view(), name="surprise-checkout"),
]
