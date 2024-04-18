from rest_framework import serializers
from .models import Cart
from .utils import update_total_price

class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = ['id', 'trip', 'user', 'trip_price', 'total_price']   
        read_only_fields = ['user','total_price']


    # def create(self, validated_data):
    #     print('recieved data:', validated_data)
    #     request = self.context.get('request')
    #     if not request:
    #         raise serializers.ValidationError("Request context is required for this operation.")
    #     user = request.user
    #     validated_data['user'] = user
    #     cart = Cart.objects.create(**validated_data)
    #     print('created cart object:', cart)
    #     update_total_price(cart)
    #     print('updated cart object:', cart.total_price)
    #     return cart
       
    def create(self, validated_data):
        print('recieved data:', validated_data)
        request = self.context.get('request')
        if not request:
            raise serializers.ValidationError("Request context is required for this operation.")
        user = request.user
        validated_data['user'] = user
        cart = Cart.objects.create(**validated_data)
        print('created cart object:', cart)
        
        # Update the total price after creating the cart
        cart.total_price = update_total_price(Cart.objects.filter(user=user))
        cart.save()  # Save the updated cart object
        
        print('updated cart object:', cart.total_price)
        return cart
