#!/usr/bin/env python3
"""
Script para iniciar Redis no Windows
"""
import subprocess
import sys
import time
import os

def check_docker():
    """Verifica se Docker está disponível"""
    try:
        result = subprocess.run(['docker', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Docker encontrado: {result.stdout.strip()}")
            return True
        else:
            print("❌ Docker não está funcionando corretamente")
            return False
    except FileNotFoundError:
        print("❌ Docker não encontrado")
        return False

def start_redis_docker():
    """Inicia Redis usando Docker"""
    print("🐳 Iniciando Redis via Docker...")
    
    try:
        # Para qualquer container Redis existente
        print("🔄 Parando containers Redis existentes...")
        subprocess.run(['docker', 'stop', 'redis-chat'], capture_output=True)
        subprocess.run(['docker', 'rm', 'redis-chat'], capture_output=True)
        
        # Inicia novo container Redis
        print("🚀 Iniciando novo container Redis...")
        result = subprocess.run([
            'docker', 'run', '-d', 
            '-p', '6379:6379', 
            '--name', 'redis-chat',
            'redis:alpine'
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            container_id = result.stdout.strip()
            print(f"✅ Redis iniciado com sucesso via Docker!")
            print(f"📦 Container ID: {container_id}")
            print(f"🌐 Porta: 6379")
            print(f"📦 Nome: redis-chat")
            return True
        else:
            print(f"❌ Erro ao iniciar Redis via Docker:")
            print(f"   {result.stderr}")
            return False
            
    except Exception as e:
        print(f"❌ Erro ao executar Docker: {e}")
        return False

def check_redis_connection():
    """Verifica se Redis está respondendo"""
    try:
        import redis
        r = redis.Redis(host='127.0.0.1', port=6379, db=0, socket_timeout=5)
        r.ping()
        print("✅ Redis está respondendo na porta 6379!")
        return True
    except ImportError:
        print("❌ Módulo redis não instalado")
        print("💡 Execute: pip install redis")
        return False
    except Exception as e:
        print(f"❌ Redis não está respondendo: {e}")
        return False

def check_port_available():
    """Verifica se a porta 6379 está disponível"""
    try:
        import socket
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        result = sock.connect_ex(('127.0.0.1', 6379))
        sock.close()
        
        if result == 0:
            print("⚠️ Porta 6379 já está em uso")
            return False
        else:
            print("✅ Porta 6379 está disponível")
            return True
    except Exception as e:
        print(f"❌ Erro ao verificar porta: {e}")
        return False

def main():
    """Função principal"""
    print("🚀 Iniciando Redis para o chat...")
    print("=" * 50)
    
    # Verifica se a porta está disponível
    if not check_port_available():
        print("\n🔍 Verificando o que está usando a porta 6379...")
        try:
            result = subprocess.run(['netstat', '-ano'], capture_output=True, text=True)
            lines = result.stdout.split('\n')
            for line in lines:
                if ':6379' in line:
                    print(f"   {line}")
        except:
            pass
        
        print("\n💡 Para liberar a porta:")
        print("   1. Docker: docker stop redis-chat")
        print("   2. Redis local: taskkill /F /PID <PID>")
        print("   3. Ou use uma porta diferente")
        return False
    
    # Verifica se Docker está disponível
    if check_docker():
        print("\n🐳 Usando Docker para iniciar Redis...")
        if start_redis_docker():
            print("\n⏳ Aguardando Redis inicializar...")
            time.sleep(3)
            
            if check_redis_connection():
                print("\n🎉 Redis iniciado com sucesso!")
                print("\n💡 Comandos úteis:")
                print("   Para parar: docker stop redis-chat")
                print("   Para ver logs: docker logs redis-chat")
                print("   Para reiniciar: docker restart redis-chat")
                return True
            else:
                print("\n❌ Redis não está respondendo após inicialização")
                return False
        else:
            print("\n❌ Falha ao iniciar Redis via Docker")
            return False
    else:
        print("\n🔧 Docker não disponível")
        print("\n📋 Alternativas para Windows:")
        print("1. Instalar Docker Desktop: https://www.docker.com/products/docker-desktop")
        print("2. Baixar Redis para Windows: https://github.com/microsoftarchive/redis/releases")
        print("3. Usar WSL2 com Redis")
        print("\n💡 Para desenvolvimento, você pode usar InMemoryChannelLayer")
        print("   (mas não funcionará com múltiplos usuários)")
        return False

if __name__ == "__main__":
    try:
        success = main()
        
        if success:
            print("\n🎯 Próximos passos:")
            print("1. Inicie o servidor Django: python manage.py runserver")
            print("2. Teste o chat: python test_chat_simple.py")
            print("\n✅ Redis está pronto para uso!")
        else:
            print("\n❌ Falha ao iniciar Redis")
            print("💡 Verifique as mensagens acima para soluções")
        
        print("\nPressione Enter para sair...")
        input()
        
    except KeyboardInterrupt:
        print("\n⏹️ Operação interrompida pelo usuário")
    except Exception as e:
        print(f"\n❌ Erro fatal: {e}")
        print("Pressione Enter para sair...")
        input()
