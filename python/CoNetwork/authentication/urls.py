from authentication import views
from django.urls import path

app_name = 'authentication'
urlpatterns = [
    path('register/', views.register, name='register'),
    path('register/confirm', views.confirm, name='confirm'),
    path('profile/<int:id>', views.userprofile, name='profile'),
    path('profile/change_password/', views.change_pass, name='change_password'),
    path('login/', views.log_in, name='login'),
    path('logout/', views.log_out, name='log_out'),
    path('reset_password/', views.reset_password, name='reset_password'),  # НУЖНО БУДЕТ ПЕРЕРАБОТАТЬ, В ССЫЛКЕ ДОЛЖЕН БЫТЬ СПЕЦТОКЕН
    path('yandex_auth/', views.yandex_auth, name='yandex authentication')
]