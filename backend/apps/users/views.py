from django.core.cache import cache
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_headers
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.users.models import User, PasswordResetToken
from apps.users.serializers import UserSerializer, PasswordChangeSerializer, AccountActivationSerializer, \
    PasswordResetSerializer, ProfileSerializer, ProfileImageSerializer
from apps.users.tasks import send_activation_and_password_reset, send_password_reset_email


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        if response.status_code == status.HTTP_201_CREATED:
            send_activation_and_password_reset.delay(response.data['email'], response.data['name'])

        return response


class ProfileAPIView(APIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = self.serializer_class(data=request.data, instance=request.user)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        cache.delete_pattern('*profile*')
        return Response(
            data={'message': 'Profile updated successfully'},
        )

    @method_decorator(cache_page(60 * 60, key_prefix='profile'))
    @method_decorator(vary_on_headers('Authorization'))
    def get(self, request):
        serializer = self.serializer_class(instance=request.user, context={'request': request})
        return Response(data=serializer.data)


class PasswordChangeAPIView(APIView):
    serializer_class = PasswordChangeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            data={'message': 'Password changed successfully'},
        )


class AccountActivationAPIView(APIView):
    serializer_class = AccountActivationSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(data={'message': 'Account activated successfully'})


class PasswordResetAPIView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = PasswordResetSerializer

    def post(self, request, action):
        if action == 'send':
            email = request.data.get('email', None)

            if email is None:
                return Response(
                    data={'email': ['Email is required']},
                    status=status.HTTP_400_BAD_REQUEST
                )

            last_sent_at = PasswordResetToken.objects.filter(user__email=email).order_by('-id').first()
            if last_sent_at and last_sent_at.expires_at > timezone.now():
                retry_in = ((last_sent_at.expires_at - timezone.now()).seconds + 59) // 60
                return Response(
                    data={'message': f'Please wait {retry_in} minutes before retrying'},
                )

            send_password_reset_email.delay(email)

            return Response(
                data={'message': 'Password reset email sent successfully'},
            )
        else:
            serializer = self.serializer_class(data=request.data)
            serializer.is_valid(raise_exception=True)

            return Response(
                data={'message': 'Password reset successful'},
            )


class ProfileImageAPIView(APIView):
    serializer_class = ProfileImageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = self.serializer_class(data=request.data, instance=request.user)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        cache.delete_pattern('*profile*')
        return Response(
            data={'message': 'Profile image uploaded successfully'},
        )
