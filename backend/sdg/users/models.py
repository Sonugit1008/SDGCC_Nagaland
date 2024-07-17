from pickle import FALSE
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.db.models import CharField
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone as tzz
from django.contrib.postgres.fields import JSONField, ArrayField

# from organization.models import Department


class UserManager(BaseUserManager):

    def create_user(self, email, password=None, **extra_fields):
        """Creates and saves a new user"""
        if not email:
            raise ValueError('users must have an email address')
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        """Creates and saves a new superuser"""
        user = self.create_user(email, password)
        user.is_staff = True
        user.is_active = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractUser):
    """Default user for darsaapi.
    """

    #: First and last name do not cover name patterns around the globe
    email = CharField(_("Email of User"), blank=False, unique=True, max_length=255)
    mobile = CharField(_("Mobile of User"), blank=True, max_length=255)

    def get_absolute_url(self):
        """Get url for user's detail view.

        Returns:
            str: URL for user detail.

        """
        return reverse("users:detail", kwargs={"username": self.username})

    def save(self, *args, **kwargs):
        # Convert the email address to lowercase before saving
        self.email = self.email.lower()
        super().save(*args, **kwargs)
        
@receiver(pre_save, sender=User)
def update_username_from_email(sender, instance, **kwargs):
    instance.username = instance.email


def mask_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT / user_<id>/<filename>
    return "user/profile/{}.{}".format(filename, "jpg")

class Address(models.Model):
    address1 = models.CharField("Address line 1", max_length=255, blank=False)
    address2 = models.CharField("Address line ", max_length=255, blank=True, null=True)
    locality_area = models.CharField("Locality Area", max_length=255, blank=True, null=True)
    landmark = models.CharField("Landmark", max_length=255, blank=True, null=True)
    city = models.CharField("City", max_length=255, blank=False)
    state = models.CharField("State", max_length=255, blank=False)
    country = models.CharField("Country", max_length=255, blank=False)
    zip_code = models.CharField("Zip Postal Code ", max_length=255, blank=True, null=True)
    address_type = models.CharField("Address Type", max_length=255, blank=False)


class UserProfile(models.Model):
    """User Profile Model"""
    user = models.OneToOneField(get_user_model(), related_name="user", primary_key=True, on_delete=models.CASCADE)
    # department = models.ManyToManyField(Department, related_name="user", blank=True)
    first_name = models.CharField(max_length=255, blank=True, null=True)
    last_name = models.CharField(max_length=255, blank=True, null=True)
    gender = models.CharField(max_length=2, default="M")
    address = models.ForeignKey(Address, on_delete=models.DO_NOTHING, blank=True, null=True)
    is_deleted = models.BooleanField(default=False)
    timezone = models.CharField(max_length=255, blank=True)
    profile_picture = models.FileField(upload_to=mask_directory_path, max_length=254, blank=True, null=True)
    email_otp = models.CharField(max_length=6, null=True)
    email_otp_timestamp = models.DateTimeField(default=tzz.now)
    otp_count = models.IntegerField(default=0)

