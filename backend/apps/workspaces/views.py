from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from apps.workspaces.models import Workspace
from apps.workspaces.serializers import WorkspaceSerializer


class WorkspacesViewSet(viewsets.ModelViewSet):
    queryset = Workspace.objects.all()
    serializer_class = WorkspaceSerializer
    permission_classes = (IsAuthenticated, IsAdminUser)
