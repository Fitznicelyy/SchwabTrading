"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from data.views import SymbolRatingView, get_news, get_sentiment, delete_all_symbol_ratings, load_symbol_ratings, get_token, handler404, get_schwab_data, post_schwab_data

router = routers.DefaultRouter()
router.register(r'symbolRating', SymbolRatingView, 'symbolRating')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/get_news/', get_news, name='get_news'),
    path('api/get_sentiment/', get_sentiment, name='get_sentiment'),
    path('api/delete_all_symbol_ratings/', delete_all_symbol_ratings, name='delete_all_symbol_ratings'),
    path('api/load_symbol_ratings/', load_symbol_ratings, name='load_symbol_ratings'),
    path('api/get_token/', get_token, name='get_token'),
    path('api/get_schwab_data/', get_schwab_data, name='get_schwab_data'),
    path('api/post_schwab_data/', post_schwab_data, name='post_schwab_data'),
    path('', handler404, name='handler404'),
]
