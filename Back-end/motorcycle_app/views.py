from django.http import JsonResponse
import http.client
import json 
from dotenv import dotenv_values
from rest_framework.views import APIView
from .serializers import BikeSerializer, Bike
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_204_NO_CONTENT,
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_401_UNAUTHORIZED
)

env=dotenv_values(".env")

def get_motorcycle_info(motorcycle_id):
    # hard coding prices for each bike since the api does not provide them
    prices={
        "817774":115,
        "331639": 185,
        "148037": 143,
        "997759": 120,
        "752591": 98,

    }
     # http.client sends request from django server. allows for keeping keys hidden. fairly simple, may need to try something different for scalability
    conn = http.client.HTTPSConnection("motorcycle-specs-database.p.rapidapi.com")
    headers = {
            "X-RapidAPI-Key": env.get("MOTORCYCLE_API_KEY"),
            'X-RapidAPI-Host': "motorcycle-specs-database.p.rapidapi.com"
    }
    # get the specs from the api
    conn.request("GET", f"/article/{motorcycle_id}", headers=headers) 
    response = conn.getresponse()
    data_details = response.read()
    
    if response.status == 200:
        data=json.loads(data_details.decode("utf-8"))
        motorcycle_data = data.get('articleCompleteInfo', {})
        if motorcycle_id in prices:
            motorcycle_data['price'] = prices[motorcycle_id]
        else:
            motorcycle_data['price'] = None
        conn.close()
        return motorcycle_data
    else:
        conn.close()
        return None



class AllMotorcycles(APIView):
    def get(self, request, *args, **kwargs):
        motorcycle_ids = ["817774", "331639"]#, "752591", "148037", "997759"]
        serialized_bike_data=[]
        for motorcycle_id in motorcycle_ids:
            data = get_motorcycle_info(motorcycle_id)
            if data:
                bike, created = Bike.objects.update_or_create(
                 make=data.get('makeName'),
                    model=data.get('modelName'),
                    defaults={
                        'description': data.get('categoryName'),
                        'price': data.get('price')
                    }
                )
                serializer=BikeSerializer(bike)
                serialized_bike_data.append(serializer.data)
        return Response(serialized_bike_data, status=HTTP_200_OK)


# add the motorcycle details to the sql database
    def post(self, request, *args, **kwargs):
        serializer = BikeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # Saves the Bike instance if valid
            return Response(serializer.data, status=HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


# NEED TO HANDLE IMAGES

        
        