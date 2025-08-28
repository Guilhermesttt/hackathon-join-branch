from django.urls import path
from . import views

urlpatterns = [
    path('save-checkin/', views.save_daily_checkin, name='save_daily_checkin'),
    path('checkins/<int:user_id>/', views.get_user_checkins, name='get_user_checkins'),
]
