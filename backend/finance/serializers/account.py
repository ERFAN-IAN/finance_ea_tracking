from rest_framework import serializers

from finance.models import Account


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['name', 'type', 'balance', 'is_active', 'id']
        read_only_fields = ['is_active']

    def validate(self, attrs):
        user = self.context["request"].user
        name = attrs.get("name")

        qs = Account.objects.filter(
            user=user,
            name=name,
        )

        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)

        if qs.exists():
            raise serializers.ValidationError({
                "name": "You already have an account with this name."
            })

        return attrs
