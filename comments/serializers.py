from rest_framework import serializers
from .models import Comment


class CommentSerializer(serializers.ModelSerializer):
  user = serializers.ReadOnlyField(source='user.username')

  class Meta:
    model  = Comment
    fields = ['id', 'post', 'user', 'content', 'created_at']