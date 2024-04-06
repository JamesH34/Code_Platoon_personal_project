from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    pass



"""
creating a model then inheriting from abstractuser allows some auto functionality 
with user authentication. 
also allows for customization if needed at a later time.
"""