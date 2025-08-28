import json
import logging
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from user.models import CustomUser

logger = logging.getLogger(__name__)

# Import Firebase de forma segura
try:
    import firebase_admin
    from firebase_admin import auth
    FIREBASE_AVAILABLE = True
except ImportError:
    logger.warning("Firebase não disponível - usando autenticação anônima")
    FIREBASE_AVAILABLE = False

class FirebaseWebSocketAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        # Extract token from query string or headers
        query_string = scope.get('query_string', b'').decode()
        headers = dict(scope.get('headers', []))
        
        # Try to get token from query string first (for WebSocket connections)
        token = None
        if query_string:
            params = dict(item.split('=') for item in query_string.split('&') if '=' in item)
            token = params.get('token')
        
        # If no token in query string, try Authorization header
        if not token:
            auth_header = headers.get(b'authorization', b'').decode()
            if auth_header and auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        if token and FIREBASE_AVAILABLE:
            try:
                # Verify Firebase token
                decoded_token = auth.verify_id_token(token)
                uid = decoded_token['uid']
                
                # Get or create user
                user = await self.get_or_create_user(uid, decoded_token)
                scope['user'] = user
                logger.info(f"WebSocket authenticated user: {user.name} ({uid})")
                
            except Exception as e:
                logger.error(f"WebSocket authentication failed: {e}")
                scope['user'] = AnonymousUser()
        elif token and not FIREBASE_AVAILABLE:
            logger.warning("Firebase não disponível - usando token como UID")
            # Fallback: usar token como UID para desenvolvimento
            try:
                user = await self.get_or_create_user_fallback(token)
                scope['user'] = user
                logger.info(f"WebSocket authenticated user (fallback): {user.name} ({token})")
            except Exception as e:
                logger.error(f"Fallback authentication failed: {e}")
                scope['user'] = AnonymousUser()
        else:
            logger.warning("No authentication token provided for WebSocket - usando usuário anônimo para testes")
            # Para testes, permitir usuários anônimos
            scope['user'] = AnonymousUser()
        
        return await super().__call__(scope, receive, send)
    
    @database_sync_to_async
    def get_or_create_user(self, uid, decoded_token):
        """Get or create user from database"""
        try:
            user, created = CustomUser.objects.get_or_create(
                username=uid,
                defaults={
                    'email': decoded_token.get('email', ''),
                    'name': decoded_token.get('name', 'Usuário'),
                    'type': 'user',  # Default type
                    'phone': '',  # Default empty phone
                }
            )
            
            # Update user info if not created
            if not created:
                if decoded_token.get('email') and user.email != decoded_token.get('email'):
                    user.email = decoded_token.get('email')
                if decoded_token.get('name') and user.name != decoded_token.get('name'):
                    user.name = decoded_token.get('name')
                user.save()
            
            return user
            
        except Exception as e:
            logger.error(f"Error getting/creating user: {e}")
            # Return anonymous user if there's an error
            return AnonymousUser()
    
    @database_sync_to_async
    def get_or_create_user_fallback(self, token):
        """Fallback method for when Firebase is not available"""
        try:
            # Use token as username for development
            user, created = CustomUser.objects.get_or_create(
                username=token,
                defaults={
                    'email': f'{token}@dev.local',
                    'name': f'Usuário {token[:8]}',
                    'type': 'user',
                    'phone': '',
                }
            )
            
            return user
            
        except Exception as e:
            logger.error(f"Error in fallback user creation: {e}")
            return AnonymousUser()
