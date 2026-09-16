from django.urls import path
from . import views
urlpatterns = [path('event/', views.AnalyticsEventView.as_view(), name='analytics-event')]
