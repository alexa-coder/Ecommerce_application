from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    is_admin = models.BooleanField(default=False)
    
    def save(self, *args, **kwargs):
        # Make sure all superusers are admins
        if self.is_superuser:
            self.is_admin = True
        super().save(*args, **kwargs)