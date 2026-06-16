from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from django.contrib.auth import logout
from rest_framework.response import Response
from rest_framework.views import APIView

from users.serializers.auth import UserRegistrationSerializer
from django.views.decorators.csrf import ensure_csrf_cookie


class RegisterView(CreateAPIView):
    serializer_class = UserRegistrationSerializer


class LoginView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    @method_decorator(csrf_protect)
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(request, username=username, password=password)

        if user is None:
            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        login(request, user)

        return Response({"success": True})


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({"success": True})


@ensure_csrf_cookie
def csrf(request):
    return JsonResponse({"ok": True})
