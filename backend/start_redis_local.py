#!/usr/bin/env python3
"""
Script para iniciar Redis localmente
"""
import subprocess
import sys
import os
import time

def start_redis():
    """Inicia Redis localmente"""
    print("🚀 Iniciando Redis localmente...")
    
    try:
        # Tenta usar Docker se disponível
        print("🐳 Tentando usar Docker...")
        result = subprocess.run([
            "docker", "run", "-d", 
            "-p", "6379:6379", 
            "--name", "redis-chat",
            "redis:alpine"
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Redis iniciado com Docker!")
            print(f"Container ID: {result.stdout.strip()}")
            return True
        else:
            print("❌ Docker não disponível ou erro:")
            print(result.stderr)
            
    except FileNotFoundError:
        print("❌ Docker não encontrado")
    
    try:
        # Tenta usar Redis local se instalado
        print("🔧 Tentando usar Redis local...")
        result = subprocess.run([
            "redis-server", "--port", "6379"
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Redis local iniciado!")
            return True
        else:
            print("❌ Redis local não disponível")
            
    except FileNotFoundError:
        print("❌ Redis local não encontrado")
    
    print("\n📋 Instruções para instalar Redis:")
    print("1. Docker (recomendado):")
    print("   docker run -d -p 6379:6379 --name redis-chat redis:alpine")
    print("\n2. Windows:")
    print("   Baixe de: https://github.com/microsoftarchive/redis/releases")
    print("\n3. Linux/Mac:")
    print("   sudo apt-get install redis-server  # Ubuntu/Debian")
    print("   brew install redis                 # macOS")
    
    return False

def check_redis():
    """Verifica se Redis está rodando"""
    try:
        import redis
        r = redis.Redis(host='127.0.0.1', port=6379, db=0)
        r.ping()
        print("✅ Redis está rodando na porta 6379!")
        return True
    except Exception as e:
        print(f"❌ Redis não está rodando: {e}")
        return False

if __name__ == "__main__":
    if check_redis():
        print("🎉 Redis já está rodando!")
    else:
        start_redis()
        time.sleep(3)
        if check_redis():
            print("🎉 Redis iniciado com sucesso!")
        else:
            print("❌ Falha ao iniciar Redis")
