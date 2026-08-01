from django.urls import path
from . import views

urlpatterns = [
    # HTML pages
    path('login/', views.login_page, name='login'),
    path('register/', views.register_page, name='register'),
    path('profile/', views.profile_page, name='profile'),

    # API endpoints
    path('api/register/', views.api_register, name='api_register'),
    path('api/login/', views.api_login, name='api_login'),
    path('api/logout/', views.api_logout, name='api_logout'),
    path('api/me/', views.api_me, name='api_me'),
    path('api/profile/', views.api_update_profile, name='api_update_profile'),
    path('api/change-password/', views.api_change_password, name='api_change_password'),
]
