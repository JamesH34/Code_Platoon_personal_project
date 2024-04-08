from .models import User
from rest_framework import serializers
from django.contrib.auth import authenticate

class CreateUser(serializers.ModelSerializer):
    class Meta:
        model=User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    
    def create(self, data):
        user = User(
            email = data['email'],
            username = data['username']
        )
        user.set_password(data['password'])
        user.save()
        return user
    

class LogIn(serializers.Serializer):
    username=serializers.CharField()
    password=serializers.CharField(style={'input_type': 'password'})

    def validate(self, data):
        username=data.get('username')
        password=data.get('password')

        if username and password:
            user=authenticate(request=self.context.get('request'), username=username, password=password)

            if not user:
                message = 'Incorrect User Credentials.'
                raise serializers.ValidationError(message, code='authorization')
        else:
            message=('Must include username and password')
            raise serializers.ValidationError(message, code='authorization')

        data['user'] = user
        return data