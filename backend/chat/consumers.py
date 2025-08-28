import json
import logging
from datetime import datetime
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.contrib.auth.models import AnonymousUser

logger = logging.getLogger(__name__)

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        """Handle WebSocket connection"""
        try:
            # Configurar dados básicos
            self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
            self.room_group_name = f"chat_{self.room_name}"
            
            # Obter usuário do scope
            self.user = self.scope.get('user', AnonymousUser())
            
            # Configurar informações do usuário
            if self.user.is_authenticated:
                self.user_id = str(self.user.id)
                self.user_name = getattr(self.user, 'name', self.user.username)
                self.user_avatar = self.user.photo.url if hasattr(self.user, 'photo') and self.user.photo else None
            else:
                # ID único para usuários anônimos
                self.user_id = f"anonymous_{abs(hash(self.channel_name)) % 100000}"
                self.user_name = "Usuário Anônimo"
                self.user_avatar = None
            
            logger.info(f"🔌 Conectando: {self.user_name} ({self.user_id}) -> Sala: {self.room_name}")
            
            # ACEITAR CONEXÃO PRIMEIRO
            self.accept()
            
            # Entrar no grupo da sala
            async_to_sync(self.channel_layer.group_add)(
                self.room_group_name, 
                self.channel_name
            )
            
            # Verificar se entrou no grupo
            try:
                group_info = async_to_sync(self.channel_layer.group_channels)(self.room_group_name)
                logger.info(f"✅ Grupo {self.room_group_name}: {len(group_info)} usuários conectados")
            except Exception as e:
                logger.warning(f"Não foi possível verificar grupo: {e}")
            
            # Confirmar conexão
            self.send_json({
                'type': 'connection_established',
                'room': self.room_name,
                'user_id': self.user_id,
                'user_name': self.user_name,
                'user_avatar': self.user_avatar,
                'message': 'Conectado com sucesso!',
                'timestamp': datetime.now().isoformat()
            })
            
            logger.info(f"✅ {self.user_name} conectado à sala {self.room_name}")
            
        except Exception as e:
            logger.error(f"❌ Erro na conexão: {e}")
            self.close()

    def disconnect(self, close_code):
        """Handle WebSocket disconnection"""
        logger.info(f"🔌 Desconectando: {self.user_name} da sala: {self.room_name}")
        
        try:
            # Sair do grupo
            async_to_sync(self.channel_layer.group_discard)(
                self.room_group_name, 
                self.channel_name
            )
            logger.info(f"✅ {self.user_name} desconectado da sala {self.room_name}")
        except Exception as e:
            logger.error(f"❌ Erro na desconexão: {e}")

    def receive(self, text_data):
        """Handle incoming WebSocket message"""
        try:
            data = json.loads(text_data)
            message_type = data.get('type', 'chat_message')
            
            logger.info(f"📨 Mensagem recebida - Tipo: {message_type}, De: {self.user_name}")
            
            # Responder a ping
            if message_type == 'ping':
                self.send_json({
                    'type': 'pong', 
                    'timestamp': datetime.now().isoformat()
                })
                return
            
            # Processar mensagem de chat
            if message_type == 'chat_message':
                message = data.get('message', '').strip()
                
                if not message:
                    self.send_json({
                        'type': 'error',
                        'message': 'Mensagem não pode estar vazia'
                    })
                    return
                
                logger.info(f"💬 Processando mensagem de {self.user_name}: '{message[:50]}...'")
                
                # TRANSMITIR MENSAGEM
                self.transmit_message(message)
            
        except json.JSONDecodeError as e:
            logger.error(f"❌ Erro JSON: {e}")
            self.send_json({
                'type': 'error',
                'message': 'Formato inválido'
            })
        except Exception as e:
            logger.error(f"❌ Erro ao processar mensagem: {e}")
            self.send_json({
                'type': 'error', 
                'message': 'Erro interno'
            })

    def transmit_message(self, message):
        """Transmit message to all users in room"""
        timestamp = datetime.now().isoformat()
        
        # Dados da mensagem
        message_data = {
            'type': 'broadcast_message',  # Nome diferente para evitar loop
            'message': message,
            'user_id': self.user_id,
            'user_name': self.user_name,
            'user_avatar': self.user_avatar,
            'room': self.room_name,
            'timestamp': timestamp,
            'sender_channel': self.channel_name
        }
        
        logger.info(f"📡 Transmitindo mensagem de {self.user_name} para grupo {self.room_group_name}")
        
        # Verificar quantos usuários estão no grupo
        try:
            group_channels = async_to_sync(self.channel_layer.group_channels)(self.room_group_name)
            logger.info(f"👥 Usuários no grupo {self.room_group_name}: {len(group_channels)}")
            logger.info(f"🔍 Canais no grupo: {group_channels}")
        except Exception as e:
            logger.warning(f"⚠️ Não foi possível verificar usuários no grupo: {e}")
        
        # 1. PRIMEIRO: Confirmar para o remetente (opcional - mostra que foi enviada)
        self.send_json({
            'type': 'message_sent',
            'message': message,
            'user_id': self.user_id,
            'user_name': self.user_name,
            'user_avatar': self.user_avatar,
            'timestamp': timestamp,
            'is_own': True
        })
        
        # 2. SEGUNDO: Enviar para todos no grupo
        try:
            logger.info(f"📤 Enviando mensagem para grupo via channel_layer.group_send")
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                message_data
            )
            logger.info(f"✅ Mensagem transmitida com sucesso para grupo {self.room_group_name}")
            
            # Verificar se a mensagem foi enviada
            logger.info(f"🔍 Verificando se mensagem foi enviada para {len(group_channels)} usuários")
            
        except Exception as e:
            logger.error(f"❌ Erro ao transmitir mensagem: {e}")
            logger.error(f"🔍 Detalhes do erro: {type(e).__name__}: {str(e)}")
            self.send_json({
                'type': 'error',
                'message': 'Erro ao enviar mensagem'
            })

    def broadcast_message(self, event):
        """Handle message broadcast from room group"""
        try:
            sender_channel = event.get('sender_channel')
            
            logger.info(f"📨 Recebendo broadcast - De: {event.get('user_name')}, Para: {self.user_name}")
            logger.info(f"🔍 Canal remetente: {sender_channel}, Canal atual: {self.channel_name}")
            logger.info(f"📋 Dados do evento: {event}")
            
            # NÃO ENVIAR DE VOLTA PARA O REMETENTE
            if sender_channel == self.channel_name:
                logger.info(f"⏭️ Pulando - é o próprio remetente")
                return
            
            # Preparar dados para envio
            response_data = {
                'type': 'chat_message',
                'message': event['message'],
                'user_id': event['user_id'],
                'user_name': event['user_name'],
                'user_avatar': event.get('user_avatar'),
                'room': event.get('room'),
                'timestamp': event['timestamp'],
                'is_own': False
            }
            
            logger.info(f"📤 Enviando mensagem para {self.user_name}: '{event['message'][:30]}...'")
            logger.info(f"📋 Dados de resposta: {response_data}")
            
            # Enviar via WebSocket
            self.send_json(response_data)
            
            logger.info(f"✅ Mensagem entregue para {self.user_name}")
            
        except Exception as e:
            logger.error(f"❌ Erro no broadcast_message: {e}")
            logger.error(f"🔍 Detalhes do erro: {type(e).__name__}: {str(e)}")
            logger.error(f"Event data: {event}")
            logger.error(f"User info: {self.user_name} ({self.user_id})")

    def send_json(self, data):
        """Send JSON data via WebSocket"""
        try:
            json_data = json.dumps(data, ensure_ascii=False)
            self.send(text_data=json_data)
            
            # Log apenas para mensagens importantes
            if data.get('type') in ['chat_message', 'message_sent']:
                logger.info(f"📡 JSON enviado para {self.user_name}: {data.get('type')}")
                
        except Exception as e:
            logger.error(f"❌ Erro ao enviar JSON: {e}")

    # Método adicional para debug
    def connection_test(self, event):
        """Test connection method"""
        self.send_json({
            'type': 'connection_test_response',
            'message': 'Teste de conexão OK',
            'timestamp': datetime.now().isoformat()
        })