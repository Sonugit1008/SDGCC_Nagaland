# Generated by Django 3.2.12 on 2022-07-20 05:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('organization', '0012_auto_20220718_0554'),
    ]

    operations = [
        migrations.AddField(
            model_name='score',
            name='vetted_by',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='name'),
        ),
    ]
