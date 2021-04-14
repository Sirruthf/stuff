from django.urls import path
from main import views
from session import views as session_views
app_name = 'main'
urlpatterns = [
    path('', views.index, name='index'),
    path('contact_us/', views.contact_us, name='contact_us'),
    path('about_us/', views.about_us, name='about_us'),
]

