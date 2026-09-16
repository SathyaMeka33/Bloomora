from django.urls import path
from . import views

urlpatterns = [
    path("gift-finder/", views.GiftFinderAIView.as_view(), name="ai-gift-finder"),
    path("chat/", views.AIChatView.as_view(), name="ai-chat"),
    path("conversations/", views.AIConversationListView.as_view(), name="ai-conversations"),
    path("conversations/<int:pk>/", views.AIConversationDetailView.as_view(), name="ai-conversation-detail"),
    path("greeting-message/", views.AIGreetingMessageView.as_view(), name="ai-greeting-message"),
    path("budget-optimizer/", views.AIBudgetOptimizerView.as_view(), name="ai-budget-optimizer"),
]
