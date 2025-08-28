import os
import django

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "app.settings")
django.setup()

from chat.routing import websocket_urlpatterns
from chat.authentication import FirebaseWebSocketAuthMiddleware

# Aplicação ASGI com middleware personalizado para Firebase
application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": AllowedHostsOriginValidator(
            FirebaseWebSocketAuthMiddleware(
                URLRouter(websocket_urlpatterns)
            )
        ),
    },
)