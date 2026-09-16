from rest_framework import generics
from .models import Reminder
from .serializers import ReminderSerializer

class ReminderListCreateView(generics.ListCreateAPIView):
    serializer_class = ReminderSerializer
    def get_queryset(self):
        return Reminder.objects.filter(user=self.request.user, active=True)

class ReminderDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReminderSerializer
    def get_queryset(self):
        return Reminder.objects.filter(user=self.request.user)
