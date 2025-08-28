#!/usr/bin/env python3
"""
Teste de debug para verificar transmissão de mensagens
"""
import asyncio
import websockets
import json
import time

async def test_debug():
    """Teste de debug do chat"""
    uri = "ws://localhost:8000/ws/chat/debug_room/"
    
    print("🧪 Teste de Debug - Transmissão de Mensagens")
    print("=" * 50)
    
    try:
        # Conecta primeiro usuário
        print("👤 Conectando usuário 1...")
        async with websockets.connect(uri) as ws1:
            print("✅ Usuário 1 conectado!")
            
            # Aguarda confirmação de conexão
            try:
                response = await asyncio.wait_for(ws1.recv(), timeout=5.0)
                print(f"📥 Usuário 1 recebeu: {response}")
            except asyncio.TimeoutError:
                print("⏰ Timeout na conexão do usuário 1")
                return
            
            # Conecta segundo usuário
            print("👤 Conectando usuário 2...")
            async with websockets.connect(uri) as ws2:
                print("✅ Usuário 2 conectado!")
                
                # Aguarda confirmação de conexão
                try:
                    response = await asyncio.wait_for(ws2.recv(), timeout=5.0)
                    print(f"📥 Usuário 2 recebeu: {response}")
                except asyncio.TimeoutError:
                    print("⏰ Timeout na conexão do usuário 2")
                    return
                
                # Usuário 1 envia mensagem
                print("\n💬 Usuário 1 enviando mensagem...")
                message1 = {
                    "type": "chat_message",
                    "message": "Olá! Sou o usuário 1"
                }
                await ws1.send(json.dumps(message1))
                print("📤 Mensagem enviada pelo usuário 1")
                
                # Aguarda usuário 2 receber a mensagem
                print("⏳ Aguardando usuário 2 receber mensagem...")
                try:
                    response = await asyncio.wait_for(ws2.recv(), timeout=10.0)
                    print(f"📥 Usuário 2 recebeu: {response}")
                    
                    # Verifica se é uma mensagem de chat
                    data = json.loads(response)
                    if data.get('type') == 'chat_message':
                        print("✅ Mensagem recebida corretamente pelo usuário 2!")
                        print(f"   Conteúdo: {data.get('message')}")
                        print(f"   Remetente: {data.get('user_name')}")
                        print(f"   É própria: {data.get('is_own')}")
                        print(f"   User ID: {data.get('user_id')}")
                    else:
                        print(f"❌ Tipo de mensagem inesperado: {data.get('type')}")
                        
                except asyncio.TimeoutError:
                    print("⏰ Timeout - usuário 2 não recebeu mensagem")
                    print("❌ PROBLEMA: Mensagem não foi transmitida!")
                
                # Aguarda um pouco
                await asyncio.sleep(2)
                
                # Usuário 2 envia mensagem
                print("\n💬 Usuário 2 enviando mensagem...")
                message2 = {
                    "type": "chat_message",
                    "message": "Oi! Sou o usuário 2"
                }
                await ws2.send(json.dumps(message2))
                print("📤 Mensagem enviada pelo usuário 2")
                
                # Aguarda usuário 1 receber a mensagem
                print("⏳ Aguardando usuário 1 receber mensagem...")
                try:
                    response = await asyncio.wait_for(ws1.recv(), timeout=10.0)
                    print(f"📥 Usuário 1 recebeu: {response}")
                    
                    # Verifica se é uma mensagem de chat
                    data = json.loads(response)
                    if data.get('type') == 'chat_message':
                        print("✅ Mensagem recebida corretamente pelo usuário 1!")
                        print(f"   Conteúdo: {data.get('message')}")
                        print(f"   Remetente: {data.get('user_name')}")
                        print(f"   É própria: {data.get('is_own')}")
                        print(f"   User ID: {data.get('user_id')}")
                    else:
                        print(f"❌ Tipo de mensagem inesperado: {data.get('type')}")
                        
                except asyncio.TimeoutError:
                    print("⏰ Timeout - usuário 1 não recebeu mensagem")
                    print("❌ PROBLEMA: Mensagem não foi transmitida!")
                
                print("\n🏁 Teste concluído!")
                
    except Exception as e:
        print(f"❌ Erro: {e}")

if __name__ == "__main__":
    asyncio.run(test_debug())
