# Generated by Django 4.2.17 on 2025-01-10 23:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('SimpleApp', '0002_alter_number_value'),
    ]

    operations = [
        migrations.AlterField(
            model_name='number',
            name='value',
            field=models.IntegerField(),
        ),
    ]
