# Generated by Django 2.0.5 on 2018-05-11 05:14

import django.contrib.postgres.fields.jsonb
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('scraper', '0009_auto_20180511_0502'),
    ]

    operations = [
        migrations.AlterField(
            model_name='activitylevel',
            name='level',
            field=django.contrib.postgres.fields.jsonb.JSONField(default=dict),
        ),
        migrations.AlterField(
            model_name='detailedmenu',
            name='detailedMenu',
            field=django.contrib.postgres.fields.jsonb.JSONField(default=dict),
        ),
        migrations.AlterField(
            model_name='hour',
            name='hours',
            field=django.contrib.postgres.fields.jsonb.JSONField(default=dict),
        ),
        migrations.AlterField(
            model_name='overviewmenu',
            name='overviewMenu',
            field=django.contrib.postgres.fields.jsonb.JSONField(default=dict),
        ),
        migrations.AlterField(
            model_name='recipe',
            name='nutrition',
            field=django.contrib.postgres.fields.jsonb.JSONField(default=dict),
        ),
    ]
