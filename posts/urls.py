from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet
from comments.views import CommentListCreateView

router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='post')

urlpatterns = [
  path('', include(router.urls)),
  # Nested route: /api/posts/{post_pk}/comments/
  path('posts/<int:post_pk>/comments/', CommentListCreateView.as_view(), name='post-comments'),
]