#!/usr/bin/env python3
"""
Teste de debug para verificar se o Redis está funcionando
"""
import asyncio
import websockets
import json
import time

async def test_redis_debug():
    """Teste de debug do Redis"""
    uri = "ws://localhost:8000/ws/chat/redis_test/"
    
    print("🧪 Teste de Debug - Redis e Transmissão")
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
                data1 = json.loads(response)
                print(f"   Room: {data1.get('room')}")
                print(f"   User: {data1.get('user_name')}")
                print(f"   User ID: {data1.get('user_id')}")
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
                    data2 = json.loads(response)
                    print(f"   Room: {data2.get('room')}")
                    print(f"   User: {data2.get('user_name')}")
                    print(f"   User ID: {data2.get('user_id')}")
                except asyncio.TimeoutError:
                    print("⏰ Timeout na conexão do usuário 2")
                    return
                
                # Verifica se estão na mesma sala
                if data1.get('room') != data2.get('room'):
                    print("❌ PROBLEMA: Usuários em salas diferentes!")
                    print(f"   Usuário 1: {data1.get('room')}")
                    print(f"   Usuário 2: {data2.get('room')}")
                    return
                
                print(f"✅ Ambos usuários na mesma sala: {data1.get('room')}")
                
                # Usuário 1 envia mensagem
                print("\n💬 Usuário 1 enviando mensagem...")
                message1 = {
                    "type": "chat_message",
                    "message": "Teste Redis - Usuário 1"
                }
                await ws1.send(json.dumps(message1))
                print("📤 Mensagem enviada pelo usuário 1")
                
                # Aguarda usuário 2 receber a mensagem
                print("⏳ Aguardando usuário 2 receber mensagem...")
                try:
                    response = await asyncio.wait_for(ws2.recv(), timeout=15.0)
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
                    print("   Isso indica problema no Redis ou na lógica de broadcast")
                
                # Aguarda um pouco
                await asyncio.sleep(3)
                
                # Usuário 2 envia mensagem
                print("\n💬 Usuário 2 enviando mensagem...")
                message2 = {
                    "type": "chat_message",
                    "message": "Teste Redis - Usuário 2"
                }
                await ws2.send(json.dumps(message2))
                print("📤 Mensagem enviada pelo usuário 2")
                
                # Aguarda usuário 1 receber a mensagem
                print("⏳ Aguardando usuário 1 receber mensagem...")
                try:
                    response = await asyncio.wait_for(ws1.recv(), timeout=15.0)
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
                    print("   Isso indica problema no Redis ou na lógica de broadcast")
                
                print("\n🏁 Teste concluído!")
                
    except Exception as e:
        print(f"❌ Erro: {e}")

if __name__ == "__main__":
    asyncio.run(test_redis_debug())
