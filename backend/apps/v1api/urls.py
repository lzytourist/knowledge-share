from django.urls import path, include

urlpatterns = [
    path('v1/users/', include('apps.users.urls')),
]
