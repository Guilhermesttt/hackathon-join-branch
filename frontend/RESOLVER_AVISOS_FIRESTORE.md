# 🔧 Resolver Avisos do Firestore

## Problema
Os avisos que você está vendo são causados porque o Firestore precisa de índices compostos para consultas que combinam `where` + `orderBy`.

## Solução 1: Configurar Índices (Recomendado)

### Passo 1: Instalar Firebase CLI
```bash
npm install -g firebase-tools
```

### Passo 2: Executar o script de configuração
```bash
# No Windows (PowerShell)
./setup-firestore-indexes.sh

# Ou executar manualmente:
firebase login
firebase use hackathon-8b0e1
firebase deploy --only firestore:indexes
```

## Solução 2: Usar Firebase Console

1. Acesse: https://console.firebase.google.com/project/hackathon-8b0e1
2. Vá para **Firestore Database** → **Índices**
3. Clique em **Criar Índice**
4. Configure os seguintes índices:

### Índice 1: Posts por visibilidade e data
- **Coleção**: `posts`
- **Campos**: 
  - `visibility` (Ascending)
  - `createdAt` (Descending)

### Índice 2: Posts por usuário e data
- **Coleção**: `posts`
- **Campos**:
  - `userId` (Ascending)
  - `createdAt` (Descending)

### Índice 3: Comentários por post e data
- **Coleção**: `comments`
- **Campos**:
  - `postId` (Ascending)
  - `createdAt` (Ascending)

## Solução 3: Consultas Simples (Temporária)

Se não quiser configurar índices agora, as consultas já foram modificadas para usar dados mockados quando houver erro de índice.

## Resultado
Após configurar os índices, os avisos devem parar de aparecer e o Firebase funcionará normalmente.

## ⚠️ Importante
Os índices podem levar alguns minutos para serem criados. Aguarde a mensagem de sucesso antes de testar novamente.
