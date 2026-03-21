from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from blog_api.pagination import PostPagination
from .models import Post
from .serializers import PostSerializer
from .permissions import IsAuthorOrReadOnly
from rest_framework.permissions import IsAuthenticatedOrReadOnly


class PostViewSet(viewsets.ModelViewSet):
  queryset           = Post.objects.all().order_by('-created_at')
  serializer_class   = PostSerializer
  permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]
  pagination_class   = PostPagination

  # Filter/search/ordering config
  filter_backends  = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
  filterset_fields = ['author__username']           # exact match: ?author__username=alice
  search_fields    = ['title', 'content']           # keyword: ?search=django
  ordering_fields  = ['created_at', 'title']        # sort: ?ordering=-created_at

  def perform_create(self, serializer):
    serializer.save(author=self.request.user)