from rest_framework import serializers
from .models import Trips
from motorcycle_app.serializers import BikeSerializer

class TripSerializer(serializers.ModelSerializer):
    bike = BikeSerializer(source = 'bike_id', read_only=True)
    class Meta:
        model = Trips
        # fields = ['id', 'bike_id', 'user_id', 'start_date', 'end_date', 'total_cost']
        fields = '__all__'  


   