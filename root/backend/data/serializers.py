from rest_framework import serializers
from .models import SymbolRating

class SymbolRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SymbolRating
        fields = ('id', 'date', 'symbol', 'rating', 'aggregate')