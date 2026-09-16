from django.db import models

class Reminder(models.Model):
    user = models.ForeignKey("accounts.User", on_delete=models.CASCADE, related_name="reminders")
    title = models.CharField(max_length=200)
    recipient_name = models.CharField(max_length=100)
    relationship = models.CharField(max_length=50, blank=True)
    occasion = models.CharField(max_length=100)
    date = models.DateField()
    budget = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    notes = models.TextField(blank=True)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "bloomora_reminders"
        ordering = ["date"]

    def __str__(self):
        return f"{self.title} - {self.date}"
