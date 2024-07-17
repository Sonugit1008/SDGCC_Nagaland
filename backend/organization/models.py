from django.contrib.auth import get_user_model
from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.utils import timezone
from django.core.files.storage import FileSystemStorage
fs = FileSystemStorage(location='media')

class State(models.Model):
    name = models.CharField("State Name", max_length=255, blank=False, null=True)
    is_deleted = models.BooleanField(blank=True, null=True, default=False)
    deleted_by = models.CharField(null=True, blank=True, max_length=255)
    deleted_at = models.DateTimeField(default=timezone.now)


class District(models.Model):
    name = models.CharField("District Name", max_length=255, blank=True, null=True)
    state = models.ForeignKey(State, related_name="district", on_delete=models.CASCADE, blank=True)
    is_deleted = models.BooleanField(blank=True, null=True, default=False)
    deleted_by = models.CharField(null=True, blank=True, max_length=255)
    deleted_at = models.DateTimeField(default=timezone.now)


class Location(models.Model):
    name = models.CharField("Location Name", max_length=255, blank=False, null=False)
    latitude = models.CharField("Location Latitude", max_length=255, blank=False, null=False)
    longitude = models.CharField("Location Longitude", max_length=255, blank=False, null=False)
    district = models.ForeignKey(District, related_name="location", on_delete=models.CASCADE, blank=True)
    pincode = models.CharField("Location Pincode", max_length=255, blank=True, null=True)
    description = models.CharField("Location Description", max_length=255, blank=True, null=True)
    is_deleted = models.BooleanField(blank=True, null=True, default=False)
    deleted_by = models.CharField(null=True, blank=True, max_length=255)
    deleted_at = models.DateTimeField(default=timezone.now)


class Department(models.Model):
    name = models.CharField("Department Name", max_length=255, blank=True, null=True)
    state = models.ForeignKey(State, related_name="department", on_delete=models.CASCADE, blank=True)
    users = models.ManyToManyField(get_user_model(), blank=True)
    is_deleted = models.BooleanField(blank=True, null=True, default=False)
    deleted_by = models.CharField(null=True, blank=True, max_length=255)
    deleted_at = models.DateTimeField(default=timezone.now)


class Goal(models.Model):
    sno = models.IntegerField("Goal SNO", blank=True, null=True, default=0)
    name = models.CharField("Goal Name", max_length=255, blank=True, null=True)
    state = models.ForeignKey(State, related_name="goal", on_delete=models.CASCADE, blank=True)
    image = models.ImageField(storage=fs, blank=True, null=True)
    is_deleted = models.BooleanField(blank=True, null=True, default=False)
    deleted_by = models.CharField(null=True, blank=True, max_length=255)
    deleted_at = models.DateTimeField(default=timezone.now) 


class Periodicity(models.Model):
    name = models.CharField("Periodicity Name", max_length=255, blank=True, null=True)
    no_of_days = models.CharField("Periodicity Days", max_length=255, blank=True, null=True)
    is_deleted = models.BooleanField(blank=True, null=True, default=False)
    deleted_by = models.CharField(null=True, blank=True, max_length=255)
    deleted_at = models.DateTimeField(default=timezone.now) 


class Unit(models.Model):
    Academic = 'Academic Unit'
    Standard = 'Standard Unit'

    UNIT_CHOICES = (
        (Academic, 'Academic Unit'),
        (Standard, 'Standard Unit'),
    )

    name = models.CharField("Unit Name", max_length=255, blank=True, null=True)
    type = models.CharField(max_length=255, choices=UNIT_CHOICES, default=Standard, )
    value = models.CharField("Unit Value", max_length=255, blank=True, null=True)


class Scheme(models.Model):
    name = models.CharField("Scheme Name", max_length=500, blank=True, null=True)
    description = models.CharField("Scheme Description", max_length=255, blank=True, null=True)
    scheme_comment = models.CharField("Scheme Comment", max_length=255, blank=True, null=True)
    is_deleted = models.BooleanField(blank=True, null=True, default=False)
    deleted_by = models.CharField(null=True, blank=True, max_length=255)
    deleted_at = models.DateTimeField(default=timezone.now)


class Indicator(models.Model):
    
    name = models.CharField("Indicator Name", max_length=255, blank=True, null=True)
    department =  models.ForeignKey(Department, related_name="indicator", on_delete=models.CASCADE, blank=False)
    goal = models.ForeignKey(Goal, related_name="indicator", on_delete=models.CASCADE, blank=False)
    periodicity = models.ForeignKey(Periodicity, related_name="indicator", on_delete=models.CASCADE, blank=False)
    scheme = models.ForeignKey(Scheme, related_name="indicator", on_delete=models.CASCADE, blank=True, null=True)
    unit = models.ForeignKey(Unit, related_name="indicator", on_delete=models.CASCADE, blank=True)
    type = models.CharField("Indicator Type", default="DIF", max_length=255, blank=True, null=True)
    year = models.CharField("Indicator Year", max_length=255, blank=True, null=True, default="2021")
    comment = models.CharField("Indicator Comment", max_length=255, blank=True, null=True)
    denominator_label = models.CharField("Indicator Denominator Label", max_length=255, blank=True, null=True)
    numerator_label = models.CharField("Indicator Numerator Label", max_length=255, blank=True, null=True)
    is_deleted = models.BooleanField(blank=True, null=True, default=False)
    deleted_by = models.CharField(null=True, blank=True, max_length=255)
    deleted_at = models.DateTimeField(default=timezone.now)


class IndicatorValue(models.Model):
    # Baseline = 'baseline'
    # Progress = 'progress'
    # Target = 'target'

    # VALUE_CHOICES = (
    #     (Baseline, 'baseline'),
    #     (Progress, 'progress'),
    #     (Target, 'target'),
    # )

    indicator = models.ForeignKey(Indicator, related_name="indicatorvalue", on_delete=models.CASCADE, blank=True)
    # value_type = models.CharField(max_length=255, choices=VALUE_CHOICES, default=Baseline, )
    # start_year = models.IntegerField(blank=True,null=True) 
    # end_year = models.IntegerField(blank=True,null=True)
    baseline_value = models.CharField("Indicator Baseline Value",max_length=255, blank=True, null=True)
    progress_value = models.CharField("Indicator Progress Value",max_length=255, blank=True, null=True)
    short_value = models.CharField("Indicator short target Value",max_length=255, blank=True, null=True)
    mid_value = models.CharField("Indicator mid target Value",max_length=255, blank=True, null=True)
    value = models.CharField("Indicator target Value",max_length=255, blank=True, null=True)
    district = models.ForeignKey(District, related_name="indicatorvalue", on_delete=models.CASCADE, blank=True, null=True)


class Score(models.Model):
    
    Aspirant = 'Aspirant'
    Performer = 'Performer'
    FrontRunner = 'Front Runner'
    Achiever = 'Achiever'
    NoTarget = 'No Target'

    CATEGORY_CHOICES = (
        (Aspirant, 'Aspirant'),
        (Performer, 'Performer'),
        (FrontRunner, 'Front Runner'),
        (Achiever, 'Achiever'),
        (NoTarget, 'No Target'),
    )
    
    value = models.CharField("Score", max_length=255, blank=False, null=False)
    goal = models.ForeignKey(Goal, related_name="score", on_delete=models.CASCADE, blank=False)
    type = models.CharField("type", max_length=255, blank=False, null=False)
    name = models.CharField("name", max_length=255, blank=False, null=False)
    indicator = models.ForeignKey(Indicator, related_name="score", on_delete=models.CASCADE, blank=True, null=True)
    indicator_value = models.CharField("Indicator Score", max_length=255, blank=True, null=True)
    year = models.CharField("Score", max_length=255, blank=False)
    remarks = models.CharField("Remarks", max_length=255, blank=True, null=True)
    vetted_by_department = models.BooleanField(blank=True, null=True, default=False)
    vetted_by_officer = models.BooleanField(blank=True, null=True, default=False)
    vetted_by = models.CharField("vetted by name", max_length=255, blank=True, null=True)
    report_date = models.DateTimeField(default=timezone.now)
    category = models.CharField(max_length=255, choices=CATEGORY_CHOICES, default=Aspirant, )


class Reports(models.Model):
    sno = models.CharField("sno", max_length=255, blank=True, null=True)
    name = models.CharField("Report Name", max_length=255, blank=True, null=True)
    file = models.FileField(storage=fs, blank=True, null=True)


class NewScores(models.Model):
    
    Aspirant = 'Aspirant'
    Performer = 'Performer'
    FrontRunner = 'Front Runner'
    Achiever = 'Achiever'
    NoTarget = 'No Target'

    CATEGORY_CHOICES = (
        (Aspirant, 'Aspirant'),
        (Performer, 'Performer'),
        (FrontRunner, 'Front Runner'),
        (Achiever, 'Achiever'),
        (NoTarget, 'No Target'),
    )
    
    numerator_value = models.CharField("Numerator Score", max_length=255, blank=True, null=True)
    denominator_value = models.CharField("Denominator Score", max_length=255, blank=True, null=True)
    score_value = models.CharField("Calculated Score", max_length=255, blank=True, null=True)
    goal = models.ForeignKey(Goal, related_name="newscores", on_delete=models.CASCADE, blank=False)
    score = models.ForeignKey(Score, related_name="newscores", on_delete=models.SET_NULL, null=True)
    name = models.CharField("name", max_length=255, blank=False, null=True)
    type = models.CharField("type", max_length=255, blank=True, null=True)
    indicator = models.ForeignKey(Indicator, related_name="newscores", on_delete=models.CASCADE, blank=True, null=True)
    remarks = models.CharField("Remarks", max_length=255, blank=True, null=True)
    vetted_by_department = models.BooleanField(blank=True, null=True, default=False)
    vetted_by_officer = models.BooleanField(blank=True, null=True, default=False)
    vetted_by = models.CharField("vetted by name", max_length=255, blank=True, null=True)
    year = models.CharField("Year",max_length=255,blank=True,null=True)
    report_date = models.DateTimeField(default=timezone.now)
    status = models.CharField(null=True, blank=True, max_length=255, default="pending")
    category = models.CharField(max_length=255, choices=CATEGORY_CHOICES, default=Aspirant, )
    action_by = models.CharField(null=True, blank=True, max_length=255)
    action_time = models.DateTimeField(default=timezone.now)
    reject_reason = models.CharField("Reject Reason", max_length=255, blank=True, null=True)
    is_deleted = models.BooleanField(blank=True, null=True, default=False)
    deleted_by = models.CharField(null=True, blank=True, max_length=255)
    deleted_at = models.DateTimeField(default=timezone.now)
    created_by = models.CharField(max_length=255, null=True, blank=True, default='user')


class Ranks(models.Model):
    
    district = models.ForeignKey(District, related_name="ranks", on_delete=models.CASCADE, blank=False, null=False)
    year = models.IntegerField(blank=True,null=True) 
    rank = models.IntegerField("Rank Value", blank=True, null=True, default=0)
    is_deleted = models.BooleanField(blank=True, null=True, default=False)
    deleted_by = models.CharField(null=True, blank=True, max_length=255)
    deleted_at = models.DateTimeField(default=timezone.now)
    created_by = models.CharField(max_length=255, null=True, blank=True, default='user')
