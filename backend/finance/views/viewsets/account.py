from finance.serializers.account import AccountSerializer
from finance.views.viewsets.base import UserOwnedModelViewSet


class AccountViewset(UserOwnedModelViewSet):
    serializer_class = AccountSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.order_by("-created_at")
