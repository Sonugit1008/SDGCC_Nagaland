# Generated by Django 3.2.12 on 2023-10-16 08:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_alter_userprofile_email_otp_timestamp'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='otp_count',
            field=models.IntegerField(default=0),
        ),
    ]