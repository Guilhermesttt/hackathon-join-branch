import firebase_admin
from firebase_admin import credentials, auth
from rest_framework import authentication, exceptions
from django.contrib.auth import get_user_model
from django.conf import settings

# Inicialize o Firebase apenas uma vez
if not firebase_admin._apps:
    cred_path = settings.BASE_DIR / 'serviceAccountKey.json'
    cred = credentials.Certificate(str(cred_path))
    firebase_admin.initialize_app(cred)

User = get_user_model()


class FirebaseAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')

        if not auth_header:
            return None

        try:
            token = auth_header.split(' ')[1]
            decoded_token = auth.verify_id_token(token)
            uid = decoded_token['uid']

            # Buscar ou criar usuário
            user, created = User.objects.get_or_create(
                username=uid,
                defaults={
                    'email': decoded_token.get('email', ''),
                    'first_name': decoded_token.get('name', '').split(' ')[0]
                    if decoded_token.get('name')
                    else '',
                },
            )

            return (user, None)

        except Exception as e:
            raise exceptions.AuthenticationFailed(
                f'Erro de autenticação: {str(e)}'
            )
