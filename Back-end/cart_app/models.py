from django.db import models
from trips_app.models import Trips

# Create your models here.
class Cart(models.Model):
    trip_id=models.ForeignKey(Trips, on_delete=models.CASCADE)
    total_price=models.DecimalField(max_digits=8, decimal_places=2)