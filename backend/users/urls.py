from django.urls import path
from users.views.auth import LoginView, RegisterView, csrf, LogoutView
from users.views.me import MeView

urlpatterns = [
    path("api/register/", RegisterView.as_view(), name="register"),
    path("api/login/", LoginView.as_view(), name="register"),
    path("api/logout/", LogoutView.as_view(), name="register"),
    path("api/me/", MeView.as_view(), name="me"),
    path("api/csrf/", csrf, name="csrf"),
]
