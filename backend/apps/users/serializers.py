from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import serializers

from apps.users.models import AccountActivationToken

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'email')
        extra_kwargs = {'id': {'read_only': True}}


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate(self, attrs):
        old_password = attrs.get('old_password')
        new_password = attrs.get('new_password')

        if old_password == new_password:
            raise serializers.ValidationError('Passwords can\'t be the same')

        user = self.context['request'].user
        if not user.check_password(old_password):
            raise serializers.ValidationError('In correct old password')

        return attrs

    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user


class AccountActivationSerializer(serializers.Serializer):
    new_password1 = serializers.CharField(required=True)
    new_password2 = serializers.CharField(required=True)

    def validate(self, attrs):
        if not attrs.get('token'):
            raise serializers.ValidationError({'token': ['Invalid token']})

        if attrs.get('new_password1') != attrs['new_password2']:
            raise serializers.ValidationError({'new_password1': ['Passwords do not match']})

        try:
            token = attrs.get('token')
            activation_token = AccountActivationToken.objects.filter(user__password__isnull=True).get(token=token)
            if activation_token.expires_at > timezone.now():
                raise serializers.ValidationError({'token': ['Token expired']})

            user = activation_token.user
            user.set_password(attrs['new_password1'])
            user.save()
        except AccountActivationToken.DoesNotExist:
            raise serializers.ValidationError({'token': ['Invalid token']})

        return attrs

    class Meta:
        fields = ('token', 'new_password1', 'new_password2')
