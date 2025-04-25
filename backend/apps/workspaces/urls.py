from django.urls import path
from rest_framework.routers import DefaultRouter

from apps.workspaces.views import WorkspacesViewSet, RoleViewSet, PermissionViewSet

router = DefaultRouter()
router.register('roles', RoleViewSet, basename='role')
router.register('permissions', PermissionViewSet, basename='permission')
router.register('', WorkspacesViewSet, basename='workspace')

urlpatterns = []

urlpatterns += router.urls
