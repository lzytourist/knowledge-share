from django.conf import settings
from django.core.mail import EmailMessage
from django.template.loader import render_to_string

from apps.users.models import User


def send_account_created_mail_with_reset_password_link(user: User, activation_token: str):
    email = EmailMessage(
        to=[user.email],
        subject='Account Created',
        body=render_to_string('emails/users/account_created.html', {
            'user': user,
            'activation_link': f'{settings.FRONTEND_URL}/account/activate/{activation_token}',
        })
    )
    email.content_subtype = 'html'
    email.send(fail_silently=False)
