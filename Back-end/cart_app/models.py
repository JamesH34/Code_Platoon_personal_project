from django.db import models
from trips_app.models import Trips
from .utils import update_total_price

# Create your models here.
class Cart(models.Model):
    trip=models.ForeignKey(Trips, on_delete=models.CASCADE)
    trip_price=models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    total_price=models.DecimalField(max_digits=8, decimal_places=2)


    def save(self, *args, **kwargs):
        self.trip_price = self.trip.total_cost
        self.total_price = update_total_price(self)
        super().save(*args, **kwargs)