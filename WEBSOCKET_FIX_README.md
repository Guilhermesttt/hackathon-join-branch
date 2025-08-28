# Correção do WebSocket - Troca de Mensagens entre Usuários

## Problemas Identificados

1. **Autenticação Firebase não funcionava com WebSocket**: O middleware padrão do Django Channels não suporta autenticação Firebase
2. **Campo inexistente**: O modelo `CustomUser` não tinha o campo `profile_image`, mas sim `photo`
3. **Falta de middleware personalizado**: Não havia um middleware que passasse o token de autenticação do frontend para o backend
4. **Configuração Redis**: Problemas de conectividade com Redis remoto

## Soluções Implementadas

### 1. Middleware de Autenticação Personalizado
- Criado `backend/chat/authentication.py` com `FirebaseWebSocketAuthMiddleware`
- Suporta autenticação via token Firebase na query string ou header Authorization
- Cria/atualiza usuários automaticamente no banco Django

### 2. Correção do Consumer
- Corrigido campo `profile_image` para `photo` no modelo `CustomUser`
- Adicionados logs detalhados para debug
- Melhorada lógica de identificação de mensagens próprias vs. de outros usuários

### 3. Configuração ASGI Atualizada
- Substituído `AuthMiddlewareStack` padrão pelo middleware personalizado
- Configuração correta para roteamento de WebSocket

### 4. Frontend Atualizado
- Token Firebase enviado na URL do WebSocket
- Logs melhorados para debug
- Tratamento correto de mensagens recebidas

## Como Testar

### 1. Iniciar Backend
```bash
cd backend
python manage.py runserver
```

### 2. Iniciar Redis (opcional)
```bash
# Windows
start_redis.bat

# Linux/Mac
redis-server

# Docker
docker run -d -p 6379:6379 redis:alpine
```

### 3. Testar WebSocket
```bash
cd backend
python chat/test_websocket.py
```

### 4. Testar no Frontend
- Abrir dois navegadores diferentes
- Fazer login com usuários diferentes
- Acessar a mesma sala de chat
- Enviar mensagens e verificar se aparecem para o outro usuário

## Estrutura de Arquivos Modificados

```
backend/
├── chat/
│   ├── authentication.py          # NOVO: Middleware de autenticação
│   ├── consumers.py               # MODIFICADO: Correções e logs
│   └── test_websocket.py         # NOVO: Script de teste
├── app/
│   ├── asgi.py                   # MODIFICADO: Middleware personalizado
│   └── settings.py               # MODIFICADO: Channel layers
└── start_redis.bat               # NOVO: Script para Redis

frontend/
└── src/
    └── Components/
        └── LiveChat.jsx          # MODIFICADO: Token na URL
```

## Logs de Debug

O sistema agora gera logs detalhados para debug:
- Conexões WebSocket
- Autenticação de usuários
- Mensagens enviadas/recebidas
- Erros e exceções

Verifique o arquivo `debug.log` no backend para mais informações.

## Configurações Alternativas

### Para Desenvolvimento (sem Redis)
```python
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer",
    },
}
```

### Para Produção (com Redis)
```python
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("127.0.0.1", 6379)],
        },
    },
}
```

## Próximos Passos

1. Testar com dois usuários diferentes
2. Verificar logs para identificar possíveis problemas
3. Implementar persistência de mensagens se necessário
4. Adicionar funcionalidades como status online/offline
5. Implementar notificações push para mensagens não lidas
