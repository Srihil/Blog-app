from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Post
from .serializers import PostSerializer
from .permissions import IsAuthorOrReadOnly


class PostViewSet(viewsets.ModelViewSet):
  queryset           = Post.objects.all().order_by('-created_at')
  serializer_class   = PostSerializer
  permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]

  def perform_create(self, serializer):
    # Automatically set the logged-in user as author
    serializer.save(author=self.request.user)