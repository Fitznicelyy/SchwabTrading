# Registering models
# Creates superuser
# Ligging in and using the web application

from django.contrib import admin
from .models import SymbolRating

class SymbolRatingAdmin(admin.ModelAdmin):
    list_Display = ('date', 'symbol', 'rating', 'aggregate')

# Register your models here.

admin.site.register(SymbolRating, SymbolRatingAdmin)
