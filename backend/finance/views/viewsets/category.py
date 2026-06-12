from finance.serializers.category import CategorySerializer
from finance.views.viewsets.base import UserOwnedModelViewSet


class CategoryViewset(UserOwnedModelViewSet):
    serializer_class = CategorySerializer
