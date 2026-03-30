from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAuthorOrReadOnly(BasePermission):
  """
  Anyone can read. Only the post's author can edit or delete.
  """
  def has_object_permission(self, request, view, obj):
    # SAFE_METHODS = GET, HEAD, OPTIONS — always allowed
    if request.method in SAFE_METHODS:
        return True
    # Write access only if the user IS the author
    return obj.author == request.user