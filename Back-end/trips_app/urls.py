from django.urls import path
from .views import CreateTrip, TripManagement, ViewTrips
from . import views

urlpatterns = [
    path('create/', CreateTrip.as_view(), name='create_trip'),
    path('trip_management/<int:id>/', TripManagement.as_view(), name='trip_management'),
    path('view_trips/', ViewTrips.as_view(), name='view_trips')
]