# Generated by Django 3.2.12 on 2022-07-14 09:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('organization', '0003_score_indicator'),
    ]

    operations = [
        migrations.AddField(
            model_name='score',
            name='year',
            field=models.CharField(default='', max_length=255, verbose_name='Score'),
            preserve_default=False,
        ),
    ]