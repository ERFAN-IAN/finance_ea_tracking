from finance.serializers.expense import ExpenseSerializer
from finance.views.viewsets.base import UserOwnedModelViewSet


class PaymentViewset(UserOwnedModelViewSet):
    serializer_class = ExpenseSerializer
