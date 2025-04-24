from django.contrib.auth import get_user_model
from django.db import models


class Workspace(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'workspaces'
        indexes = [
            models.Index(fields=['name']),
        ]


class Permission(models.Model):
    label = models.CharField(max_length=100)
    codename = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.label

    class Meta:
        db_table = 'permissions'


class Role(models.Model):
    label = models.CharField(max_length=100)
    permissions = models.ManyToManyField(Permission)

    def __str__(self):
        return self.label

    class Meta:
        db_table = 'workspace_roles'


class WorkspaceMembership(models.Model):
    workspace = models.ForeignKey(
        to=Workspace,
        on_delete=models.CASCADE,
        related_name='memberships',
    )
    user = models.ForeignKey(
        to=get_user_model(),
        on_delete=models.CASCADE,
        related_name='memberships',
    )
    role = models.ForeignKey(
        to=Role,
        on_delete=models.CASCADE,
        related_name='memberships',
    )

    class Meta:
        db_table = 'workspace_memberships'
        unique_together = ('workspace', 'user', 'role')
