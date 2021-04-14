from django.shortcuts import render, redirect
from django.http import HttpRequest, HttpResponse
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth.models import User
from main import yandex_oauth
from authentication import forms as f
from authentication.models import CustomUser
# Create your views here.


def confirm(request):
    return render(request, template_name='confirm.html')


def reset_password(request):
    return render(request, template_name='reset_password.html')


def log_out(request):
    logout(request)
    return redirect('/')


def log_in(request):
    if request.method == 'POST':
        print(request.POST)
        user = authenticate(username=request.POST['username'], password=request.POST['password'])
        if user is not None:
            login(request, user)
            return render(request, template_name='index.html', context={'request': request})
    return render(request, template_name='login.html')


def register(request):
    if request.method == 'POST':
        formUser = f.FormReg(request.POST)
        if formUser.is_valid():
            formUser.save()
            NewCustomUser = CustomUser(user=formUser.instance)
            NewCustomUser.save()
        return render(request, template_name='reg.html', context={'form': formUser})
    elif 'code' in request.GET:
        auth_code = request.GET.get('code')
        auth_token = yandex_oauth.get_oauth_json(auth_code)['access_token']
        user_json = yandex_oauth.get_account_info(auth_token)
        return render(request, template_name='reg.html', context={'login':user_json['login'], 'email':user_json['default_email']})
    return render(request, template_name='reg.html', context={'registered':False})


@login_required(login_url="/login/")
def change_pass(request):
    if request.method == 'POST':
        form = PasswordChangeForm(request.user, request.POST)
        print(request.POST)
        if form.is_valid():
            update_session_auth_hash(request, form.save())
        return render(request, template_name='change_password.html', context={'request': request, 'form': form})
    return render(request, template_name='change_password.html')


def userprofile(request, id):
    if request.method == 'POST':
        form = f.FormChangeProf(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
        return render(request, template_name='profile.html', context={'request': request, 'form': form})
    return render(request, template_name='profile.html', context={'request': request,
                                                                  'profile': CustomUser.objects.get(id=id)})
def yandex_auth(request):
    url = yandex_oauth.get_verification_url()
    return redirect(url)