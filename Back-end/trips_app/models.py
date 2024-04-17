from django.db import models
from user_app.models import User
from motorcycle_app.models import Bike
from .validators import validate_start_date
from .utils import calculate_total_cost

# Create your models here.
class Trips(models.Model):
    bike=models.ForeignKey(Bike, on_delete=models.CASCADE)
    user=models.ForeignKey(User, on_delete=models.CASCADE)
    start_date=models.DateField(validators=[validate_start_date])
    end_date=models.DateField()
    total_cost= models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

# use of ForeignKey allows many to one relations. 
# one bike gets one trip, but one trip can have many bikes...
# CASCADE to ensure that the trip will be deleted if a parent element is deleted. 

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.total_cost = calculate_total_cost(self)
        super().save(update_fields=['total_cost'])

        
        

