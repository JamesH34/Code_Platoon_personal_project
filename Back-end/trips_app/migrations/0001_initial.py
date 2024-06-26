# Generated by Django 5.0.4 on 2024-04-06 14:01

import django.db.models.deletion
import trips_app.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('motorcycle_app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Trips',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('startDate', models.DateField(validators=[trips_app.validators.validate_start_date])),
                ('endDate', models.DateField()),
                ('bike_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='motorcycle_app.bike')),
            ],
        ),
    ]
