from rest_framework.generics import CreateAPIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.conf import settings

from finance.serializers.auth import UserRegistrationSerializer


class RegisterView(CreateAPIView):
    serializer_class = UserRegistrationSerializer


class LoginView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        access = response.data.get("access")
        refresh = response.data.get("refresh")
        if access:
            response.set_cookie(
                key="access_token",
                value=access,
                httponly=True,
                secure=False,
                samesite="Lax",
                max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
            )

        if refresh:
            response.set_cookie(
                key="refresh_token",
                value=refresh,
                httponly=True,
                secure=False,
                samesite="Lax",
                max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
            )

        return response
