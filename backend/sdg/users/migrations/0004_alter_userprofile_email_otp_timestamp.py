# Generated by Django 3.2.12 on 2023-10-16 08:23

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_auto_20231003_1321'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='email_otp_timestamp',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]