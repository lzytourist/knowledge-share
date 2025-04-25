from django.urls import path, include

urlpatterns = [
    path('v1/users/', include('apps.users.urls')),
    path('v1/workspaces/', include('apps.workspaces.urls')),
]
