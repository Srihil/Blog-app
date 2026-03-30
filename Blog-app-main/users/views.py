from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, UserProfileSerializer


class RegisterView(generics.CreateAPIView):
  queryset           = User.objects.all()
  serializer_class   = RegisterSerializer
  permission_classes = [AllowAny]


class LogoutView(APIView):
  permission_classes = [IsAuthenticated]

  def post(self, request):
    try:
      refresh_token = request.data["refresh"]
      token = RefreshToken(refresh_token)
      token.blacklist()
      return Response({"message": "Logged out successfully."}, status=status.HTTP_205_RESET_CONTENT)
    except KeyError:
      return Response({"error": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)
    except TokenError:
      return Response({"error": "Token is invalid or already blacklisted."}, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(generics.RetrieveUpdateAPIView):
  serializer_class   = UserProfileSerializer
  permission_classes = [IsAuthenticated]

  def get_object(self):
    return self.request.user    