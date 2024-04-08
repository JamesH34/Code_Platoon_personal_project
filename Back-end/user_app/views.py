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
)
from django.contrib.auth import authenticate
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
            user.set_password(user.password)
            user.save()
            token = Token.objects.create(user=user)
            return Response({'user': user.username, "token": token.key}, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
      

class Log_in(APIView):
    pass

class Log_out(APIView):
    pass

class User_info(APIView):
    pass