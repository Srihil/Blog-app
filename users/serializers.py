from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile


class ProfileSerializer(serializers.ModelSerializer):
  class Meta:
    model  = Profile
    fields = ['bio', 'avatar', 'location', 'website']


class RegisterSerializer(serializers.ModelSerializer):
  password = serializers.CharField(write_only=True, min_length=6)

  class Meta:
    model  = User
    fields = ['id', 'username', 'email', 'password']

  def create(self, validated_data):
    user = User.objects.create_user(
      username=validated_data['username'],
      email=validated_data.get('email', ''),
      password=validated_data['password']
    )
    return user


class UserProfileSerializer(serializers.ModelSerializer):
  profile = ProfileSerializer()          # nested serializer

  class Meta:
    model  = User
    fields = ['id', 'username', 'email', 'profile']

  def update(self, instance, validated_data):
    # Extract nested profile data
    profile_data = validated_data.pop('profile', {})

    # Update User fields
    instance.username = validated_data.get('username', instance.username)
    instance.email    = validated_data.get('email', instance.email)
    instance.save()

    # Update Profile fields
    profile = instance.profile
    for field, value in profile_data.items():
      setattr(profile, field, value)
    profile.save()

    return instance