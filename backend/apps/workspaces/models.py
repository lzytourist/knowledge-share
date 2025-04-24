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
