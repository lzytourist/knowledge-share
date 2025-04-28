from rest_framework import serializers

from apps.workspaces.models import Workspace, Permission, Role


class WorkspaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workspace
        fields = '__all__'


class PermissionSerializer(serializers.ModelSerializer):
    def update(self, instance, validated_data):
        depends_on_id = validated_data.get('depends_on')
        if depends_on_id:
            depends_on = Permission.objects.get_dependency_list(depends_on_id.pk if isinstance(depends_on_id, Permission) else depends_on_id)
            if instance.id in depends_on.values_list('id', flat=True):
                raise serializers.ValidationError({'depends_on': ['Circular dependency detected']})
        return super().update(instance, validated_data)

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
