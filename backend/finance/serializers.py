from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from finance.models import Category, Account, Expense, Payment

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name']

    def validate(self, attrs):
        user = self.context["request"].user
        name = attrs.get("name")

        if Category.objects.filter(user=user, name=name).exists():
            raise serializers.ValidationError({
                "name": "You already have a category with this name."
            })

        return attrs


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['name', 'type', 'balance', 'is_active']
        read_only_fields = ['is_active']

    def validate(self, attrs):
        user = self.context["request"].user
        name = attrs.get("name")

        if Account.objects.filter(user=user, name=name).exists():
            raise serializers.ValidationError({
                "name": "You already have an account with this name."
            })

        return attrs


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ['category', 'expense_type', 'status', 'total_amount', 'incurred_on', 'note']
        extra_kwargs = {
            'note': {'required': False},
            'category': {'required': False},
            'status': {'required': False},
            'incurred_on': {'required': False},
        }


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['expense', 'account', 'amount', 'opening', 'paid_on', 'status', 'note']
        extra_kwargs = {
            'note': {'required': False},
            'category': {'required': False},
            'status': {'required': False},
            'incurred_on': {'required': False},
        }


class UserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True},
            'password2': {'write_only': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
