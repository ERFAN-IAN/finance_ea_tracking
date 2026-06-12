from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated


class UserOwnedModelViewSet(viewsets.ModelViewSet):
    user_field = "user"
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(**{self.user_field: self.request.user})

    def perform_create(self, serializer):
        serializer.save(**{self.user_field: self.request.user})
