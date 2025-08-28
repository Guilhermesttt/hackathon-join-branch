from django.urls import path
from .views import phrase_day_view

urlpatterns = [path('phrase/', phrase_day_view, name='phrase_of_the_day')]
