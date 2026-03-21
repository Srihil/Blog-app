from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth.models import User
from .serializers import RegisterSerializer

class RegisterView(generics.CreateAPIView):
  queryset           = User.objects.all()
  serializer_class   = RegisterSerializer
  permission_classes = [AllowAny]   # override global — anyone can register

class LogoutView(APIView):
  permission_classes = [IsAuthenticated]   # must be logged in to log out

  def post(self, request):
    try:
      refresh_token = request.data["refresh"]
      token = RefreshToken(refresh_token)
      token.blacklist()               
      return Response(
        {"message": "Logged out successfully."},
        status=status.HTTP_205_RESET_CONTENT
      )
    except KeyError:
      return Response(
        {"error": "Refresh token is required."},
        status=status.HTTP_400_BAD_REQUEST
      )
    except TokenError:
      return Response(
        {"error": "Token is invalid or already blacklisted."},
        status=status.HTTP_400_BAD_REQUEST
      )