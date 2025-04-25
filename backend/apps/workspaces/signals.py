from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.workspaces.models import Workspace, Role


@receiver(post_save, sender=Workspace)
def create_roles_for_workspace(created, instance, **kwargs):
    if created:
        """
        Create initial roles for workspace. Permissions can be updated later.
        Only Admin User will have permission to create and modify workspace roles.
        """
        roles = [
            Role(label='Viewer', workspace=instance),
            Role(label='Contributor', workspace=instance),
            Role(label='Moderator', workspace=instance),
        ]
        Role.objects.bulk_create(roles)
