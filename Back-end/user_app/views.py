from django.shortcuts import render
from django.core.exceptions import ValidationError
from django.contrib.auth import login, logout, authenticate
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_204_NO_CONTENT,
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_401_UNAUTHORIZED
)
from django.contrib.auth import authenticate
from django.utils import timezone
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from .models import User
from .serializers import CreateUser

# Create your views here.

class Sign_up(APIView):
    def post(self, request):
        serializer = CreateUser(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token = Token.objects.create(user=user)
            return Response({'user': user.username, "token": token.key}, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
      

class Log_in(APIView):
    def post(self, request):
        username=request.data.get('username')
        password=request.data.get('password')
        user=authenticate(username=username, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            user.last_login = timezone.now()
            user.save(update_fields=['last_login'])
            return Response({'token': token.key, 'user': user.username})
        else:
            return Response({"Incorrect login credentials"}, status = HTTP_400_BAD_REQUEST)

class Log_out(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        return Response({"message": "User logged out successfully"}, status=HTTP_204_NO_CONTENT)


class User_info(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.is_authenticated:
            user_data={
                "id": user.id,
                "username": user.username,
                "email": user.email
            }
            return Response(user_data, status=HTTP_200_OK)
        else:
            return Response({'error': 'User is not authenticated'}, status=HTTP_401_UNAUTHORIZED)