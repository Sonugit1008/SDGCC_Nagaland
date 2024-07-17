from django.contrib import admin
from organization import models

# Register your models here.


admin.site.register(models.State)
admin.site.register(models.District)
admin.site.register(models.Location)
admin.site.register(models.Department)
admin.site.register(models.Goal)
admin.site.register(models.Periodicity)
admin.site.register(models.Unit)
admin.site.register(models.Indicator)
admin.site.register(models.IndicatorValue)
admin.site.register(models.Scheme)
admin.site.register(models.Reports)

