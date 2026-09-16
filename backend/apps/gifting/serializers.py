from rest_framework import serializers
from .models import RecipientProfile, GiftDNA, GiftMemory


class RecipientSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipientProfile
        fields = ["id","name","relationship","age","city","created_at","updated_at"]
        read_only_fields = ["id","created_at","updated_at"]

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)


class GiftDNASerializer(serializers.ModelSerializer):
    class Meta:
        model = GiftDNA
        fields = ["id","recipient","interests","personality","style","dislikes","preferred_categories","favorite_colors","favorite_chocolates","notes","updated_at"]
        read_only_fields = ["id","updated_at"]


class GiftMemorySerializer(serializers.ModelSerializer):
    recipient_name = serializers.ReadOnlyField(source="recipient.name")

    class Meta:
        model = GiftMemory
        fields = ["id","recipient","recipient_name","product","product_name_snapshot","category_snapshot","occasion","gifted_at","rating","notes","created_at"]
        read_only_fields = ["id","recipient_name","created_at"]

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        if validated_data.get("product"):
            validated_data["product_name_snapshot"] = validated_data["product"].name
            validated_data["category_snapshot"] = validated_data["product"].category.name
        return super().create(validated_data)
