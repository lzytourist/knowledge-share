# Generated by Django 5.2 on 2025-04-24 13:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workspaces', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Permission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('label', models.CharField(max_length=100)),
                ('codename', models.CharField(max_length=100, unique=True)),
            ],
            options={
                'db_table': 'permissions',
            },
        ),
    ]
