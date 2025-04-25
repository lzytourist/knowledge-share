from django.urls import path
from rest_framework.routers import SimpleRouter

from apps.workspaces.views import WorkspacesViewSet

router = SimpleRouter()
router.register('', WorkspacesViewSet, basename='workspaces')

urlpatterns = [] + router.urls
