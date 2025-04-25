from rest_framework import viewsets, permissions

from apps.workspaces.models import Workspace, Role, Permission
from apps.workspaces.serializers import WorkspaceSerializer, RoleSerializer, PermissionSerializer


class WorkspacesViewSet(viewsets.ModelViewSet):
    queryset = Workspace.objects.all()
    serializer_class = WorkspaceSerializer
    permission_classes = (permissions.IsAuthenticated, permissions.IsAdminUser)

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.IsAuthenticated()]
        return super().get_permissions()


class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = (permissions.IsAuthenticated, permissions.IsAdminUser)


class PermissionViewSet(viewsets.ModelViewSet):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = (permissions.IsAuthenticated, permissions.IsAdminUser)
