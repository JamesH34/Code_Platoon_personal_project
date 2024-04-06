from django.db import models
from user_app.models import User
from motorcycle_app.models import Bike
from .validators import validate_start_date

# Create your models here.
class Trips(models.Model):
    bike_id=models.ForeignKey(Bike, on_delete=models.CASCADE)
    user_id=models.ForeignKey(User, on_delete=models.CASCADE)
    startDate=models.DateField(validators=[validate_start_date])
    endDate=models.DateField()

# use of ForeignKey allows many to one relations. 
# one bike gets one trip, but one trip can have many bikes...
# CASCADE to ensure that the trip will be deleted if a parent element is deleted. 