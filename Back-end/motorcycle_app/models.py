from django.db import models

# Create your models here.
class Bike(models.Model):
    price=models.DecimalField(max_digits=7, decimal_places=2)
    make=models.CharField(max_length=255)
    model=models.CharField(max_length=255)
    description=models.CharField(max_length=255)
    
