from django.urls import path
from . import views
urlpatterns = [
    path("", views.ReminderListCreateView.as_view(), name="reminders"),
    path("<int:pk>/", views.ReminderDetailView.as_view(), name="reminder-detail"),
]
