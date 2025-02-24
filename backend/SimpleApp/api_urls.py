from django.urls import path
from .views import increment_number, get_number, reset_number

urlpatterns = [
    path('increment/', increment_number, name='increment_number'),
    path('increment/get/', get_number, name='get_number'), 
    path('reset/', reset_number, name='reset_number'),
]
