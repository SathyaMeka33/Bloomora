from rest_framework import serializers
from .models import SurprisePackage

class SurpriseSerializer(serializers.ModelSerializer):
    class Meta:
        model = SurprisePackage
        fields = ["id","recipient_name","recipient_phone","occasion","emotion","budget","delivery_date","delivery_address","gift_message","packaging_instructions","status","event_type","location","cake_description","flowers_description","decorations_description","food_description","notes","total","created_at","updated_at"]
        read_only_fields = ["id","created_at","updated_at"]

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)
