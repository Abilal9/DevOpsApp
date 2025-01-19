from rest_framework import serializers
from .models import Number  

class CounterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Number
        fields = ['id', 'value']
