from finance.serializers.expense import ExpenseSerializer
from finance.views.viewsets.base import UserOwnedModelViewSet


class ExpenseViewset(UserOwnedModelViewSet):
    serializer_class = ExpenseSerializer
