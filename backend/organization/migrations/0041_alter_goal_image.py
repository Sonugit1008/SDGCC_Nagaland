# Generated by Django 3.2.12 on 2023-10-09 09:54

import django.core.files.storage
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('organization', '0040_alter_scheme_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='goal',
            name='image',
            field=models.ImageField(blank=True, null=True, storage=django.core.files.storage.FileSystemStorage(location='media'), upload_to=''),
        ),
    ]
