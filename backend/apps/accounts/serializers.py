"""
Bloomora Accounts App - Serializers
"""
from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Address


class RegisterSerializer(serializers.ModelSerializer):
    """User registration - matches Bloomora API.yaml Register schema."""
    password = serializers.CharField(write_only=True, min_length=8)
    phone_number = serializers.CharField(write_only=True, required=False, allow_blank=True)
    store_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    city = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password', 'role', 'phone', 'phone_number', 'store_name', 'city']
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False},
            'role': {'required': False},
            'phone': {'required': False},
        }

    def create(self, validated_data):
        phone_number = validated_data.pop('phone_number', None)
        store_name = validated_data.pop('store_name', None)
        city = validated_data.pop('city', None)
        password = validated_data.pop('password')
        if phone_number and not validated_data.get('phone'):
            validated_data['phone'] = phone_number
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        if user.role == 'seller':
            from apps.creators.models import Seller
            Seller.objects.get_or_create(
                user=user,
                defaults={
                    'business_name': store_name or f"{user.first_name or 'Artisan'} Studio",
                    'approved': True,
                    'location': city or 'Surampalem / Rajahmundry'
                }
            )
        return user


class LoginSerializer(serializers.Serializer):
    """Login - matches Bloomora API.yaml Login schema."""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data['email'], password=data['password'])
        if not user:
            user = authenticate(email=data['email'], password=data['password'])
        if not user:
            raise serializers.ValidationError('Invalid email or password.')
        if not user.is_active:
            raise serializers.ValidationError('Account is disabled.')
        data['user'] = user
        return data


class UserProfileSerializer(serializers.ModelSerializer):
    """Full user profile."""
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'full_name',
            'role', 'phone', 'profile_image', 'gift_preferences',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'email', 'role', 'created_at', 'updated_at']


class AddressSerializer(serializers.ModelSerializer):
    """Address management."""
    class Meta:
        model = Address
        fields = [
            'id', 'label', 'full_name', 'phone',
            'address_line1', 'address_line2', 'city', 'state',
            'pincode', 'is_default', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
