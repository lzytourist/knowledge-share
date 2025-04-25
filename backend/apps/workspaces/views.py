from rest_framework import viewsets, permissions

from apps.workspaces.models import Workspace
from apps.workspaces.serializers import WorkspaceSerializer


class WorkspacesViewSet(viewsets.ModelViewSet):
    queryset = Workspace.objects.all()
    serializer_class = WorkspaceSerializer
    permission_classes = (permissions.IsAuthenticated, permissions.IsAdminUser)

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.IsAuthenticated()]
        return super().get_permissions()
