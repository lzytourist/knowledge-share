from django.conf import settings
from django.core.mail import EmailMessage
from django.template.loader import render_to_string


def send_account_created_mail_with_reset_password_link(user_email: str, name: str, activation_token: str):
    email = EmailMessage(
        to=[user_email],
        subject='Account Created',
        body=render_to_string('emails/users/account_created.html', {
            'name': name,
            'activation_link': f'{settings.FRONTEND_URL}/account/activate/{activation_token}',
        })
    )
    email.content_subtype = 'html'
    email.send(fail_silently=False)


def send_password_reset_mail(user_email: str, name: str, token: str):
    email = EmailMessage(
        to=[user_email],
        subject='Password Reset Requested',
        body=render_to_string('emails/users/reset_password.html', {
            'name': name,
            'link': f'{settings.FRONTEND_URL}/password-reset/{token}',
        })
    )
    email.content_subtype = 'html'
    email.send(fail_silently=False)
