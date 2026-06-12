from finance.models import Account
from finance.serializers.account import AccountSerializer
from finance.views.viewsets.base import UserOwnedModelViewSet


class AccountViewset(UserOwnedModelViewSet):
    serializer_class = AccountSerializer

    def get_queryset(self):
        return Account.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
