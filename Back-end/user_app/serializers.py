from .models import User
from rest_framework import serializers

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