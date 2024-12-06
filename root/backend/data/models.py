# Models for the web application in the form of classes
# Models define the structure of the application
# Tells about the actual design, relationships between the data sets,
#   and their attrubute constraints

from django.db import models

class SymbolRating(models.Model):
    date = models.CharField(max_length=20, default='')
    symbol = models.CharField(max_length=5, default='')
    rating = models.CharField(max_length=10, default='')
    aggregate = models.CharField(max_length=10, default='')

    def _str_(self):
        return self.date