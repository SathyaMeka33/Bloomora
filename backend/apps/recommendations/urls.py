from django.urls import path
from . import views
urlpatterns = [
    path("", views.RecommendationView.as_view(), name="recommendations"),
]
