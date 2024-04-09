from django.urls import path
from .views import AllMotorcycles

urlpatterns=[
    path('all_motorcycles/', AllMotorcycles.as_view(), name='motorcycles')
]