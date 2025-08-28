#!/usr/bin/env python3
"""
Teste simples do chat - verifica se as mensagens são transmitidas entre usuários
"""
import asyncio
import websockets
import json
import time
import sys

async def test_chat_transmission():
    """Testa se as mensagens são transmitidas entre usuários"""
    room_name = "test_room_123"
    uri = f"ws://localhost:8000/ws/chat/{room_name}/"
    
    print("🧪 Teste de Transmissão de Mensagens")
    print("=" * 50)
    print(f"🌐 Conectando à sala: {room_name}")
    print(f"🔗 URL: {uri}")
    
    try:
        # Conecta primeiro usuário
        print("\n👤 Conectando usuário 1...")
        async with websockets.connect(uri) as ws1:
            print("✅ Usuário 1 conectado!")
            
            # Aguarda confirmação de conexão
            try:
                response = await asyncio.wait_for(ws1.recv(), timeout=5.0)
                print(f"📥 Usuário 1 recebeu: {response}")
                data1 = json.loads(response)
                print(f"   ✅ Room: {data1.get('room')}")
                print(f"   ✅ User: {data1.get('user_name')}")
                print(f"   ✅ User ID: {data1.get('user_id')}")
            except asyncio.TimeoutError:
                print("⏰ Timeout na conexão do usuário 1")
                return False
            
            # Conecta segundo usuário
            print("\n👤 Conectando usuário 2...")
            async with websockets.connect(uri) as ws2:
                print("✅ Usuário 2 conectado!")
                
                # Aguarda confirmação de conexão
                try:
                    response = await asyncio.wait_for(ws2.recv(), timeout=5.0)
                    print(f"📥 Usuário 2 recebeu: {response}")
                    data2 = json.loads(response)
                    print(f"   ✅ Room: {data2.get('room')}")
                    print(f"   ✅ User: {data2.get('user_name')}")
                    print(f"   ✅ User ID: {data2.get('user_id')}")
                except asyncio.TimeoutError:
                    print("⏰ Timeout na conexão do usuário 2")
                    return False
                
                # Verifica se estão na mesma sala
                if data1.get('room') != data2.get('room'):
                    print("❌ PROBLEMA: Usuários em salas diferentes!")
                    print(f"   Usuário 1: {data1.get('room')}")
                    print(f"   Usuário 2: {data2.get('room')}")
                    return False
                
                print(f"✅ Ambos usuários na mesma sala: {data1.get('room')}")
                
                # Aguarda um pouco para estabilizar
                await asyncio.sleep(2)
                
                # Usuário 1 envia mensagem
                print("\n💬 Usuário 1 enviando mensagem...")
                message1 = {
                    "type": "chat_message",
                    "message": "Olá! Esta é uma mensagem de teste do usuário 1"
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
                        print("✅ SUCESSO: Mensagem transmitida do usuário 1 para usuário 2!")
                        print(f"   📝 Conteúdo: {data.get('message')}")
                        print(f"   👤 Remetente: {data.get('user_name')}")
                        print(f"   🆔 É própria: {data.get('is_own')}")
                        print(f"   🆔 User ID: {data.get('user_id')}")
                        
                        if data.get('is_own') == False:
                            print("   🎯 CORRETO: is_own = False (não é própria)")
                        else:
                            print("   ❌ PROBLEMA: is_own = True (deveria ser False)")
                            return False
                    else:
                        print(f"❌ Tipo de mensagem inesperado: {data.get('type')}")
                        return False
                        
                except asyncio.TimeoutError:
                    print("⏰ Timeout - usuário 2 não recebeu mensagem")
                    print("❌ PROBLEMA: Mensagem não foi transmitida!")
                    print("   Isso indica problema no Redis ou na lógica de broadcast")
                    return False
                
                # Aguarda um pouco
                await asyncio.sleep(3)
                
                # Usuário 2 envia mensagem
                print("\n💬 Usuário 2 enviando mensagem...")
                message2 = {
                    "type": "chat_message",
                    "message": "Oi! Esta é uma resposta do usuário 2"
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
                        print("✅ SUCESSO: Mensagem transmitida do usuário 2 para usuário 1!")
                        print(f"   📝 Conteúdo: {data.get('message')}")
                        print(f"   👤 Remetente: {data.get('user_name')}")
                        print(f"   🆔 É própria: {data.get('is_own')}")
                        print(f"   🆔 User ID: {data.get('user_id')}")
                        
                        if data.get('is_own') == False:
                            print("   🎯 CORRETO: is_own = False (não é própria)")
                        else:
                            print("   ❌ PROBLEMA: is_own = True (deveria ser False)")
                            return False
                    else:
                        print(f"❌ Tipo de mensagem inesperado: {data.get('type')}")
                        return False
                        
                except asyncio.TimeoutError:
                    print("⏰ Timeout - usuário 1 não recebeu mensagem")
                    print("❌ PROBLEMA: Mensagem não foi transmitida!")
                    print("   Isso indica problema no Redis ou na lógica de broadcast")
                    return False
                
                print("\n🎉 TESTE CONCLUÍDO COM SUCESSO!")
                print("✅ As mensagens estão sendo transmitidas entre usuários!")
                return True
                
    except Exception as e:
        print(f"❌ Erro durante o teste: {e}")
        print(f"🔍 Tipo do erro: {type(e).__name__}")
        return False

async def main():
    """Função principal"""
    print("🚀 Iniciando teste de transmissão de mensagens...")
    
    # Verifica se o servidor está rodando
    try:
        import urllib.request
        response = urllib.request.urlopen('http://localhost:8000/', timeout=5)
        print("✅ Servidor Django está rodando!")
    except Exception as e:
        print("❌ Servidor Django não está rodando!")
        print("💡 Execute: python manage.py runserver")
        return False
    
    # Executa o teste
    success = await test_chat_transmission()
    
    if success:
        print("\n🎯 RESULTADO: SUCESSO!")
        print("✅ O chat está funcionando corretamente!")
        print("✅ As mensagens são transmitidas entre usuários!")
    else:
        print("\n❌ RESULTADO: FALHA!")
        print("❌ O chat não está funcionando corretamente!")
        print("❌ As mensagens não são transmitidas entre usuários!")
    
    return success

if __name__ == "__main__":
    try:
        success = asyncio.run(main())
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n⏹️ Teste interrompido pelo usuário")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Erro fatal: {e}")
        sys.exit(1)
