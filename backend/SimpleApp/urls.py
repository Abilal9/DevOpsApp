from django.urls import path, include

urlpatterns = [
    path('api/', include('SimpleApp.api_urls')),
]
