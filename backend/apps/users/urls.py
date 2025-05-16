from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.users.views import UserViewSet, ProfileAPIView, PasswordChangeAPIView, AccountActivationAPIView, \
    PasswordResetAPIView

router = DefaultRouter()
router.register('', UserViewSet, basename='user')

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileAPIView.as_view(), name='me'),
    path('profile/password/', PasswordChangeAPIView.as_view(), name='password-change'),
    path('activate/', AccountActivationAPIView.as_view(), name='activate-account'),
    path('password-reset/<str:action>/', PasswordResetAPIView.as_view(), name='password-reset'),
] + router.urls
