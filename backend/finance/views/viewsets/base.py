from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated


class UserOwnedModelViewSet(viewsets.ModelViewSet):
    user_field = "user"
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if hasattr(self, "queryset") and self.queryset is not None:
            qs = self.queryset
        else:
            model = self.serializer_class.Meta.model
            qs = model.objects.all()

        return qs.filter(**{self.user_field: self.request.user})

    def perform_create(self, serializer):
        serializer.save(**{self.user_field: self.request.user})
