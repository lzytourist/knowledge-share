from datetime import timedelta

from celery import shared_task
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.utils.crypto import get_random_string

from apps.users.emails import send_account_created_mail_with_reset_password_link, send_password_reset_mail
from apps.users.models import AccountActivationToken, PasswordResetToken

User = get_user_model()


@shared_task
def send_activation_and_password_reset(user_email: str, name: str):
    try:
        user = User.objects.get(email=user_email)

        activation_token = get_random_string(length=32)
        send_account_created_mail_with_reset_password_link(user_email, name, activation_token)

        token_expire = timezone.now() + timedelta(days=30)

        AccountActivationToken.objects.create(
            user=user,
            token=activation_token,
            expires_at=token_expire
        )
    except User.DoesNotExist as e:
        print(str(e))
        pass


@shared_task
def send_password_reset_email(user_email: str):
    try:
        user = User.objects.get(email=user_email)

        token = get_random_string(length=32)

        send_password_reset_mail(user_email=user_email, name=user.name, token=token)

        PasswordResetToken.objects.create(
            user=user,
            token=token,
            expires_at=timezone.now() + timedelta(minutes=15)
        )
    except PasswordResetToken.DoesNotExist as e:
        print(str(e))


@shared_task
def remove_expired_password_reset_tokens():
    try:
        qs = PasswordResetToken.objects.filter(
            expires_at__lt=timezone.now()
        )

        count = qs.count()
        if count > 0:
            qs.delete()
            print(f'Cleared {count} password reset token')
    except PasswordResetToken.DoesNotExist as e:
        print(str(e))
