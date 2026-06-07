from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from finance.models import Category, Account, Expense, Payment
from finance.serializers import RegisterSerializer, CategorySerializer, AccountSerializer, ExpenseSerializer


# Create your views here.

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


class RefreshTokenView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        access = response.data.get("access")
        response.set_cookie(
            key="access_token",
            value=access,
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
        )
        return response


class RegisterView(CreateAPIView):
    serializer_class = RegisterSerializer


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "id": request.user.id,
            "username": request.user.username,
            "email": request.user.email,
        })


class CategoryViewset(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AccountViewset(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = AccountSerializer

    def get_queryset(self):
        return Account.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ExpenseViewset(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PaymentViewset(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
