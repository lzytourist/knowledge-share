from django.core.management import BaseCommand
from django_celery_beat.models import IntervalSchedule, PeriodicTask


class Command(BaseCommand):
    def handle(self, *args, **options):
        interval, _ = IntervalSchedule.objects.get_or_create(
            every=15,
            period=IntervalSchedule.MINUTES
        )

        PeriodicTask.objects.update_or_create(
            interval=interval,
            name='Clear expired password reset tokens',
            task='apps.users.tasks.remove_expired_password_reset_tokens',
        )
