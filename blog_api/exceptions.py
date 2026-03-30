from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
  # First call DRF's default handler to get the standard response
  response = exception_handler(exc, context)

  if response is not None:
  
    return Response(
      {
        "error":   True,
        "message": response.data,
        "status":  response.status_code,
      },
      status=response.status_code
    )

  return Response(
  {
      "error":   True,
      "message": "An unexpected server error occurred. Please try again later.",
      "status":  status.HTTP_500_INTERNAL_SERVER_ERROR,
    },
    status=status.HTTP_500_INTERNAL_SERVER_ERROR
  )