from rest_framework import serializers
from .models import Trips
from motorcycle_app.serializers import BikeSerializer
from motorcycle_app.models import Bike

class TripSerializer(serializers.ModelSerializer):
    bike_id = serializers.IntegerField(write_only=True)
    bike = BikeSerializer(read_only=True)
   
    class Meta:
        model = Trips
        fields = ['id', "bike_id", 'bike',  'user', 'start_date', 'end_date', 'total_cost']
        # fields = '__all__'  


    def create(self, validated_data):
        # Fetch the bike using the bike ID and assign it
        bike_id = validated_data.pop('bike_id')
        bike = Bike.objects.get(id=bike_id)  # Ensure the bike exists
        validated_data['bike'] = bike

        return super().create(validated_data)