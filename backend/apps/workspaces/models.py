from django.contrib.auth import get_user_model
from django.db import models, connection


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
        ordering = ['-created_at']


class PermissionManager(models.Manager):
    def _get_dependency_list(self, permission_id):
        """Fetch all the IDs of depending on permissions."""
        with connection.cursor() as cursor:
            cursor.execute(f"""
            WITH RECURSIVE `dependency_chain` AS (
                SELECT `id`, `depends_on_id`
                FROM {self.model._meta.db_table}
                WHERE `id` = {permission_id}
                UNION
                SELECT `p`.`id`, `p`.`depends_on_id`
                FROM {self.model._meta.db_table} `p`
                JOIN dependency_chain d ON `p`.`id` = `d`.`depends_on_id`
            )
            SELECT `id`
            FROM `dependency_chain`
            WHERE `id` = {permission_id}
            """)

            ids = [row[0] for row in cursor.fetchall()]
        return ids

    def get_dependency_list(self, permission_id):
        ids = self._get_dependency_list(permission_id)
        return self.filter(id__in=ids)


class Permission(models.Model):
    label = models.CharField(max_length=100)
    method_name = models.CharField(max_length=100, unique=True)
    depends_on = models.ForeignKey('self', on_delete=models.PROTECT, null=True, blank=True)

    objects = PermissionManager()

    def __str__(self):
        return self.label

    def clean(self):
        if self.depends_on_id:
            depends_on = Permission.objects.get_dependency_list(self.depends_on_id)
            if self.id in depends_on.values_list('id', flat=True):
                raise ValidationError('Circular dependency detected')

    class Meta:
        db_table = 'permissions'


class Role(models.Model):
    label = models.CharField(max_length=100)
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE)
    permissions = models.ManyToManyField(Permission, blank=True)

    def __str__(self):
        return self.label

    class Meta:
        db_table = 'workspace_roles'
        ordering = ['workspace', 'id']


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
