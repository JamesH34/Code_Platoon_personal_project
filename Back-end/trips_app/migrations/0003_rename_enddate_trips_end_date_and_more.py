# Generated by Django 5.0.4 on 2024-04-10 19:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trips_app', '0002_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='trips',
            old_name='endDate',
            new_name='end_date',
        ),
        migrations.RenameField(
            model_name='trips',
            old_name='startDate',
            new_name='start_date',
        ),
        migrations.AddField(
            model_name='trips',
            name='total_cost',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=10),
        ),
    ]