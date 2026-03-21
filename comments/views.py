from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Comment
from .serializers import CommentSerializer


class CommentListCreateView(generics.ListCreateAPIView):
  serializer_class   = CommentSerializer
  permission_classes = [IsAuthenticatedOrReadOnly]

  def get_queryset(self):
    # Only return comments for the specific post in the URL
    return Comment.objects.filter(post_id=self.kwargs['post_pk'])

  def perform_create(self, serializer):
    serializer.save(
      user=self.request.user,
      post_id=self.kwargs['post_pk']
    )