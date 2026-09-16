"""
Bloomora AI App - Models
AI Conversations, Gift Finder Sessions
"""
from django.db import models


class AIConversation(models.Model):
    """AI Chat conversation thread."""
    user = models.ForeignKey("accounts.User", on_delete=models.SET_NULL, null=True, blank=True)
    session_id = models.CharField(max_length=100, blank=True)
    context = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "bloomora_ai_conversations"
        ordering = ["-updated_at"]


class AIMessage(models.Model):
    """Single message in an AI conversation."""
    ROLE_CHOICES = [("user", "User"), ("assistant", "Assistant")]
    conversation = models.ForeignKey(AIConversation, on_delete=models.CASCADE, related_name="messages")
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "bloomora_ai_messages"
        ordering = ["created_at"]


class GiftFinderSession(models.Model):
    """Gift Finder wizard session state."""
    user = models.ForeignKey("accounts.User", on_delete=models.SET_NULL, null=True, blank=True)
    session_data = models.JSONField(default=dict)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "bloomora_gift_finder_sessions"
