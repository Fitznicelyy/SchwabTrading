# Generated by Django 4.2.2 on 2024-04-13 03:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('data', '0008_tickerrating_rating_alter_news_ticker_and_more'),
    ]

    operations = [
        migrations.DeleteModel(
            name='News',
        ),
    ]
