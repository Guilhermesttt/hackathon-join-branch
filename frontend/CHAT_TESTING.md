# 🧪 Testando o Chat no Frontend

## 🎯 Objetivo

Verificar se as mensagens estão sendo transmitidas entre usuários diferentes no chat em tempo real.

## 🚀 Passos para Testar

### 1. Preparar o Backend

1. **Inicie o Redis:**
   ```bash
   cd backend
   python start_redis_windows.py
   ```

2. **Inicie o servidor Django:**
   ```bash
   python manage.py runserver
   ```

3. **Verifique se está funcionando:**
   ```bash
   python test_chat_simple.py
   ```

### 2. Testar no Frontend

#### Opção A: Duas Abas do Navegador

1. **Abra duas abas do navegador**
2. **Navegue para:** `http://localhost:5173/home/chat`
3. **Na primeira aba:**
   - Digite um código de sala (ex: `test123`)
   - Clique em "Entrar"
4. **Na segunda aba:**
   - Digite o mesmo código de sala (`test123`)
   - Clique em "Entrar"
5. **Teste o envio de mensagens:**
   - Envie uma mensagem na primeira aba
   - Verifique se aparece na segunda aba
   - Envie uma mensagem na segunda aba
   - Verifique se aparece na primeira aba

#### Opção B: Dois Navegadores Diferentes

1. **Abra dois navegadores diferentes** (Chrome + Firefox, ou Edge + Chrome)
2. **Siga os mesmos passos da Opção A**

#### Opção C: Navegador + Teste Python

1. **Abra o navegador** e conecte em uma sala
2. **Execute o teste Python** na mesma sala
3. **Verifique se as mensagens aparecem em ambos**

## 🔍 O que Verificar

### ✅ Funcionando Corretamente

- **Mensagens próprias:** `isOwn: true`, aparecem à direita
- **Mensagens de outros:** `isOwn: false`, aparecem à esquerda
- **Transmissão em tempo real:** mensagens aparecem instantaneamente
- **Logs no console:** mostram transmissão bem-sucedida

### ❌ Problemas Comuns

- **Mensagens não aparecem:** problema no backend ou Redis
- **Todas as mensagens são próprias:** problema na lógica de `is_own`
- **Mensagens duplicadas:** problema no broadcast
- **Erro de conexão:** servidor não está rodando

## 🐛 Debug

### 1. Console do Navegador

Procure por estas mensagens:
```
✅ WebSocket conectado com sucesso ao backend Django!
✅ Mensagem enviada via WebSocket para o backend Django!
✅ Adicionando mensagem de outro usuário
```

### 2. Console do Backend

Procure por estas mensagens:
```
✅ Redis disponível - usando RedisChannelLayer
✅ Mensagem transmitida com sucesso para grupo chat_test123
✅ Mensagem entregue para Usuário
```

### 3. Verificar WebSocket

No DevTools > Network > WS:
- Status: `101 Switching Protocols`
- Mensagens sendo enviadas e recebidas

## 📋 Checklist de Teste

- [ ] Redis está rodando na porta 6379
- [ ] Servidor Django está rodando na porta 8000
- [ ] Frontend está rodando na porta 5173
- [ ] Dois usuários conseguem se conectar na mesma sala
- [ ] Mensagens são enviadas sem erro
- [ ] Mensagens aparecem para o remetente (`isOwn: true`)
- [ ] Mensagens aparecem para outros usuários (`isOwn: false`)
- [ ] Transmissão é em tempo real (< 1 segundo)

## 🎯 Resultado Esperado

Após o teste bem-sucedido, você deve ver:

1. **Usuário 1 envia mensagem:**
   - Aparece à direita com `isOwn: true`
   - Aparece à esquerda para usuário 2 com `isOwn: false`

2. **Usuário 2 envia mensagem:**
   - Aparece à direita com `isOwn: true`
   - Aparece à esquerda para usuário 1 com `isOwn: false`

3. **Logs mostram:**
   - Conexão WebSocket bem-sucedida
   - Transmissão de mensagens
   - Recebimento por outros usuários

## 🚨 Problemas e Soluções

### Problema: "WebSocket não conecta"
**Solução:** Verifique se o backend Django está rodando

### Problema: "Mensagens não são transmitidas"
**Solução:** Verifique se o Redis está rodando e configurado

### Problema: "Todas as mensagens são próprias"
**Solução:** Verifique a lógica de `is_own` no frontend e backend

### Problema: "Erro de CORS"
**Solução:** Verifique as configurações de CORS no Django

## 📚 Recursos

- [WebSocket Testing](https://www.piesocket.com/websocket-tester)
- [Django Channels](https://channels.readthedocs.io/)
- [Redis Documentation](https://redis.io/documentation)
