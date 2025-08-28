#!/usr/bin/env python3
"""
Teste simples sem autenticação
"""
import asyncio
import websockets
import json

async def test_simple_anon():
    """Teste básico sem autenticação"""
    uri = "ws://localhost:8000/ws/chat/test_room/"
    
    try:
        print(f"🔌 Conectando a: {uri}")
        async with websockets.connect(uri) as websocket:
            print("✅ Conectado!")
            
            # Aguarda mensagem de confirmação
            try:
                response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                print(f"📥 Recebido: {response}")
                
                # Envia mensagem de teste
                test_msg = {"type": "connection_test", "message": "teste"}
                print(f"📤 Enviando: {test_msg}")
                await websocket.send(json.dumps(test_msg))
                
                # Aguarda resposta
                response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                print(f"📥 Resposta: {response}")
                
            except asyncio.TimeoutError:
                print("⏰ Timeout - nenhuma resposta")
                
    except Exception as e:
        print(f"❌ Erro: {e}")

if __name__ == "__main__":
    print("🧪 Teste simples sem autenticação")
    print("=" * 40)
    asyncio.run(test_simple_anon())
