from django.urls import path
from .views import CreateTrip
from . import views

urlpatterns = [
    path('create/', CreateTrip.as_view(), name='create_trip'),
#     path('view_trips/', views.view_trips, name='view_trips'),
#     path('delete_trip/', views.delete_trip, name='delete_trip'),
#     path('update_trip/', views.update_trip, name='update_trip'),
#     path('trip_management/', views.trip_management, name='trip_management')
]