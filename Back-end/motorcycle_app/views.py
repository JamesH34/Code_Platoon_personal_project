from django.http import JsonResponse
import http.client
import json 
from dotenv import dotenv_values
from rest_framework.views import APIView


env=dotenv_values(".env")

class AllMotorcycles(APIView):
    def get(self, request, *args, **kwargs):
        # http.client sends request from django server. allows for keeping keys hidden. fairly simple, may need to try something different for scalability
        conn = http.client.HTTPSConnection("motorcycle-specs-database.p.rapidapi.com")
        headers = {
            "X-RapidAPI-Key": env.get("MOTORCYCLE_API_KEY"),
            'X-RapidAPI-Host': "motorcycle-specs-database.p.rapidapi.com"
        }

        # get the first bike
        conn.request("GET", "/article/817774", headers=headers) 
        res1 = conn.getresponse()
        data1 = res1.read()

        # get the second bike
        conn.request("GET", "/article/331639", headers=headers)
        res2 = conn.getresponse()
        data2 = res2.read()

        # Close the connection
        conn.close()

        
        if res1.status == 200 and res2.status == 200:
            bike1_data = json.loads(data1.decode("utf-8"))
            bike2_data = json.loads(data2.decode("utf-8"))

            combined_data = [bike1_data, bike2_data]
            return JsonResponse(combined_data, safe=False, status=200)
        else:
            return JsonResponse({'error': 'Failed to fetch data for one or both motorcycles'}, status=500)
