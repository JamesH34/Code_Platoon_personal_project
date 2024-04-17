from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Trips
from .serializers import TripSerializer
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_204_NO_CONTENT,
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_401_UNAUTHORIZED
)

# Create your views here.

class CreateTrip(APIView):
    def post(self, request, *args, **kwargs):
        print(request.data)
        serializer = TripSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
        
    def get(self, request, *args, **kwargs):
        trips = Trips.objects.all()
        serializer = TripSerializer(trips, many=True)
        return Response(serializer.data, status=HTTP_200_OK)
    
    # def put(self, request, *args, **kwargs):
    #     # user_trips = Trips.objects.filter(user_id=request.user).select_related('bike')
    #     trip = Trips.objects.get(id=request.data['id']).select_related('bike')
    #     serializer = TripSerializer(trip, data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=HTTP_200_OK)
    #     else:
    #         return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
    def put(self, request, *args, **kwargs):
        trip = get_object_or_404(Trips.objects.select_related('bike'), id=request.data.get('id'))
        serializer = TripSerializer(trip, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_200_OK)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
        
    def delete(self, request, *args, **kwargs):
        trip = Trips.objects.get(id=request.data['id'])
        trip.delete()
        return Response(status=HTTP_204_NO_CONTENT)

# def trip_management(request):
#     return render(request, 'trips_app/trip_management.html')



