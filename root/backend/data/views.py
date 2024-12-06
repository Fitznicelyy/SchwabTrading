# Views provide and interface through which a user interacts with a Django web app
# We use the concept of Serializers for making different types of views

from rest_framework import viewsets
from .serializers import SymbolRatingSerializer
from .models import SymbolRating
from django.http import JsonResponse, HttpResponse
from django.http.response import HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from openai import OpenAI
import requests
import json
import base64
import environ

env = environ.Env()

class SymbolRatingView(viewsets.ModelViewSet):
    serializer_class = SymbolRatingSerializer
    queryset = SymbolRating.objects.all()

def handler404(request, *args, **kwargs):
    if request.method == 'GET':
        data = request.GET
        if 'code' in data:
            code = data['code']
            return HttpResponseRedirect(f'http://127.0.0.1:3000/?code={code}')
        else:
            return HttpResponseRedirect('/')
    else:
        return JsonResponse({'status': 'false'})

def schwab_callback(request):
    if request.method == 'GET':
        data = request.GET
        code = data['code']
        return HttpResponseRedirect(f'http://127.0.0.1:3000/?code={code}')
    else:
        return JsonResponse({'status': 'false'})
    
def get_news(request):
    if request.method == 'GET':
        data = request.GET
        date = data['date']
        fromTime = data['fromTime']
        toTime = data['toTime']
        url = "https://newsapi.org/v2/everything"
        params = {
            'q': 'stock market',
            'apiKey': env('NEWS_API_KEY'),
            'language': 'en',
            'sortBy': 'publishedAt',
            'from': '{}T{}'.format(date, fromTime),
            'to': '{}T{}'.format(date, toTime)
        }
        response = requests.get(url, params)
        return HttpResponse(response)
    else:
        return JsonResponse({'status': 'Invalid Request'})

@csrf_exempt
def get_sentiment(request):
    if request.method == 'GET':
        data = request.GET
        messages = [
            { "role": "system", "content": "For each user, given an article and description, provide a sperate response in the form of a response object.\
             There should be as many responses as there are users.\
             The response object should include: label(index of user),\
             sentiment(positive, neutral, or negative),\
             and symbol(market symbol of the company that the article is about. If there's none, output the string null. If there's multiple, only output one.)\
             Example output if there are 2 user messages: { label: 0, sentiment: positive, symbol: AAPL }, { label: 1, sentiment: negative, symbol: GOOG }"
            }
        ]
        for d in data:
            messages.append({ "role": "user", "content": data[d] })
        client = OpenAI(api_key=env('OPENAI_API_KEY'))
        completion = client.chat.completions.create(
            model="gpt-4",
            messages=messages
        )
        return HttpResponse(completion.choices[0].message.content)
    else:
        return JsonResponse({'status': 'false'})

def delete_all_symbol_ratings(request):
    allNews=SymbolRating.objects.all()
    allNews.delete()
    return JsonResponse({'status': 'true'})

def load_symbol_ratings(request):
    if request.method == 'GET':
        data = request.GET
        startDate = data['startDate']
        endDate = data['endDate']
        newsFromPeriod = SymbolRating.objects.values().filter(date__range=(startDate, endDate))
        return HttpResponse(json.dumps(list(newsFromPeriod)))
    else:
        return JsonResponse({'status': 'false'})
    
def load_daily_symbol_ratings(request):
    if request.method == 'GET':
        data = request.GET
        startDate = data['startDate']
        endDate = data['endDate']
        newsFromPeriod = SymbolRating.objects.values().filter(date__range=(startDate, endDate))
        return HttpResponse(json.dumps(list(newsFromPeriod)))
    else:
        return JsonResponse({'status': 'false'})
    
def get_token(request):
    if request.method == 'GET':
        requestData = request.GET
        code = requestData['code']
        appKey = env('SCHWAB_API_KEY')
        appSecret = env('SCHWAB_APP_SECRET')
        headers = {'Authorization': f'Basic {base64.b64encode(bytes(f"{appKey}:{appSecret}", "utf-8")).decode("utf-8")}', 'Content-Type': 'application/x-www-form-urlencoded'}
        data = {'grant_type': 'authorization_code', 'code': code, 'redirect_uri': 'https://127.0.0.1:8000'}
        response = requests.post('https://api.schwabapi.com/v1/oauth/token', headers=headers, data=data)
        return HttpResponse(response)
    else:
        return JsonResponse({'status': 'false'})

def get_schwab_data(request):
    if request.method == 'GET':
        requestData = request.GET
        accessToken = requestData['accessToken']
        url = requestData['url']
        params = dict()
        if 'params' in requestData:
            params.update(json.loads(requestData['params']))
        headers = {'Authorization': f'Bearer {accessToken}'}
        response = requests.get(url, headers=headers, params=params)
        return HttpResponse(response)
    else:
        return JsonResponse({'status': 'false'})
    
@csrf_exempt
def post_schwab_data(request):
    if request.method == 'GET':
        requestData = request.GET
        accessToken = requestData['accessToken']
        url = requestData['url']
        params = dict()
        if 'params' in requestData:
            params.update(json.loads(requestData['params']))
        headers = {'Accept': 'application/json', 'Authorization': f'Bearer {accessToken}', 'Content-Type': 'application/json'}
        response = requests.post(url, headers=headers, json=params)
        return HttpResponse(response)
    else:
        return JsonResponse({'status': 'false'})
