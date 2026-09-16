from django.urls import path
from . import views
urlpatterns = [
    path("", views.GiftMemoryListView.as_view(), name="gift-memory-list"),
    path("<int:recipient_id>/", views.GiftMemoryByRecipientView.as_view(), name="gift-memory-recipient"),
]
