from django.db import models
from authentication.models import CustomUser
import datetime, os


class Message(models.Model):
    Author = models.ForeignKey(to=CustomUser, on_delete=models.CASCADE, verbose_name="Человек в чате")
    text = models.TextField(verbose_name='Содержимое сообщения')
    date = models.DateField(verbose_name='Дата отправления', default=datetime.date.today)
    is_read = models.BooleanField(verbose_name='Было ли прочитано сообщение', default=False)


class Dialog(models.Model):
    users = models.ForeignKey(to=CustomUser, null=True, on_delete=models.SET_NULL, verbose_name="Человек в чате")
    messages = models.ForeignKey(to=Message, on_delete=models.CASCADE, verbose_name="Человек в чате")
