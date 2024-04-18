from rest_framework import serializers
from .models import Cart
from .utils import update_total_price

class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = ['id', 'trip', 'user', 'trip_price', 'total_price']   
        read_only_fields = ['total_price']


    def create(self, validated_data):
        return Cart.objects.create(**validated_data)
       