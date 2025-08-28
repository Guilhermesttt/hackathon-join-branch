import json
import random
from django.http import JsonResponse
from django.conf import settings
from pathlib import Path


def phrase_day_view(request):
    json_path = (
        Path(settings.BASE_DIR) / 'motivational' / 'data' / 'frases.json'
    )
    with open(json_path, 'r', encoding='utf-8') as p:
        phrases = json.load(p)

    phrase = random.choice(phrases)
    return JsonResponse(phrase, safe=False)
