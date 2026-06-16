from django.urls import path, include
from rest_framework.routers import DefaultRouter
from finance.views.viewsets.account import AccountViewset
from finance.views.viewsets.category import CategoryViewset
from finance.views.viewsets.expense import ExpenseViewset

router = DefaultRouter()

router.register(r"categories", CategoryViewset, basename="category")
router.register(r"accounts", AccountViewset, basename="account")
router.register(r"expenses", ExpenseViewset, basename="expense")
urlpatterns = [
    path("api/", include(router.urls)),
]
