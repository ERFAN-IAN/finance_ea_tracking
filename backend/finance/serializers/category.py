from rest_framework import serializers

from finance.models import Category


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
