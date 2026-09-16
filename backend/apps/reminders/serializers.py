from rest_framework import serializers
from .models import Reminder

class ReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reminder
        fields = ["id","title","recipient_name","relationship","occasion","date","budget","notes","active","created_at","updated_at"]
        read_only_fields = ["id","created_at","updated_at"]

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)
