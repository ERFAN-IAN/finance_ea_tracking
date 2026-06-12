from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenVerifyView, TokenRefreshView
from finance.views.auth import LoginView, RegisterView
from finance.views.me import MeView
from finance.views.viewsets.account import AccountViewset
from finance.views.viewsets.category import CategoryViewset
from finance.views.viewsets.expense import ExpenseViewset

router = DefaultRouter()

router.register(r'categories', CategoryViewset, basename='category')
router.register(r'accounts', AccountViewset, basename='account')
router.register(r'expenses', ExpenseViewset, basename='expense')
urlpatterns = [
    path('api/token/', LoginView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/me/', MeView.as_view(), name='me'),
    path('api/', include(router.urls)),
]
