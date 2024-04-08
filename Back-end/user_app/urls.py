from django.urls import path
from .views import Sign_up, Log_in, Log_out, User_info

urlpatterns = [
    path('signup/', Sign_up.as_view(), name='signup'),
    path('login/', Log_in.as_view(), name='login'),
    path('logout/', Log_out.as_view(), name='logout'),
    path('userinfo/', User_info.as_view(), name='info'),
]