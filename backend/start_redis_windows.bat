@echo off
echo 🚀 Iniciando Redis para o chat...
echo.

REM Verifica se o Docker está disponível
docker --version >nul 2>&1
if %errorlevel% == 0 (
    echo 🐳 Docker encontrado! Iniciando Redis...
    echo.
    
    REM Para qualquer container Redis existente
    docker stop redis-chat >nul 2>&1
    docker rm redis-chat >nul 2>&1
    
    REM Inicia novo container Redis
    docker run -d -p 6379:6379 --name redis-chat redis:alpine
    
    if %errorlevel% == 0 (
        echo ✅ Redis iniciado com sucesso via Docker!
        echo 🌐 Porta: 6379
        echo 📦 Container: redis-chat
        echo.
        echo 💡 Para parar: docker stop redis-chat
        echo 💡 Para ver logs: docker logs redis-chat
    ) else (
        echo ❌ Erro ao iniciar Redis via Docker
        goto :fallback
    )
) else (
    echo ❌ Docker não encontrado
    goto :fallback
)

goto :end

:fallback
echo.
echo 🔧 Tentando métodos alternativos...
echo.

REM Verifica se Redis está rodando localmente
netstat -an | findstr :6379 >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Redis já está rodando na porta 6379!
    goto :end
)

echo 📋 Redis não está rodando. Opções:
echo.
echo 1. Instalar Docker Desktop e executar novamente
echo 2. Baixar Redis para Windows:
echo    https://github.com/microsoftarchive/redis/releases
echo 3. Usar WSL2 com Redis
echo.
echo 💡 Para desenvolvimento, você pode usar InMemoryChannelLayer
echo    (mas não funcionará com múltiplos usuários)

:end
echo.
echo 🎯 Próximos passos:
echo 1. Inicie o servidor Django: python manage.py runserver
echo 2. Teste o chat: python test_chat_simple.py
echo.
pause
