from datetime import timedelta

from celery import shared_task
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.utils.crypto import get_random_string

from apps.users.emails import send_account_created_mail_with_reset_password_link
from apps.users.models import AccountActivationToken

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
