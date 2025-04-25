from rest_framework import serializers

from apps.workspaces.models import Workspace, Permission, Role


class WorkspaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workspace
        fields = '__all__'


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = '__all__'


class RoleSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(many=True, read_only=True)
    permission_ids = serializers.ListField(required=True, write_only=True)

    def create(self, validated_data):
        permission_ids = validated_data.pop('permission_ids', [])
        validated_data['permissions'] = Permission.objects.filter(id__in=permission_ids)
        return super().create(validated_data)

    class Meta:
        model = Role
        fields = '__all__'
