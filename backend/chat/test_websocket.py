#!/usr/bin/env python3
"""
Script de teste para WebSocket
"""
import asyncio
import websockets
import json
import logging

logging.basicConfig(level=logging.DEBUG)

async def test_websocket():
    """Testa a conexão WebSocket"""
    uri = "ws://localhost:8000/ws/chat/test_room/"
    
    try:
        async with websockets.connect(uri) as websocket:
            print("✅ Conectado ao WebSocket!")
            
            # Envia mensagem de teste
            test_message = {
                "type": "connection_test",
                "message": "Teste de conexão"
            }
            
            print(f"📤 Enviando: {test_message}")
            await websocket.send(json.dumps(test_message))
            
            # Aguarda resposta
            response = await websocket.recv()
            print(f"📥 Recebido: {response}")
            
            # Envia mensagem de chat
            chat_message = {
                "type": "chat_message",
                "message": "Olá, mundo!"
            }
            
            print(f"📤 Enviando chat: {chat_message}")
            await websocket.send(json.dumps(chat_message))
            
            # Aguarda mais respostas
            try:
                while True:
                    response = await asyncio.wait_for(websocket.recv(), timeout=2.0)
                    print(f"📥 Recebido: {response}")
            except asyncio.TimeoutError:
                print("⏰ Timeout - nenhuma mensagem adicional")
                
    except Exception as e:
        print(f"❌ Erro: {e}")

if __name__ == "__main__":
    asyncio.run(test_websocket())
