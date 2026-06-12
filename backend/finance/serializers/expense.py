from rest_framework import serializers

from finance.models import Expense


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
