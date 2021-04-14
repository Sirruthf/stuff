from django.shortcuts import render


def dialogues(request):
    return render(request, template_name='dialogues.html')
