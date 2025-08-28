# Configuração do Firebase para o Projeto Sereno

Este documento descreve como configurar o Firebase para o projeto de saúde mental Sereno.

## 1. Configuração do Projeto Firebase

### 1.1 Criar Projeto
1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Clique em "Criar Projeto"
3. Digite o nome: "Sereno-Health-App"
4. Ative o Google Analytics (opcional)
5. Clique em "Criar Projeto"

### 1.2 Configurar Autenticação
1. No console Firebase, vá para "Authentication" > "Sign-in method"
2. Ative os seguintes provedores:
   - Email/Password
   - Google (opcional)
   - Facebook (opcional)
3. Configure as configurações de usuário:
   - Permitir criação de contas
   - Verificação de email (recomendado)

### 1.3 Configurar Firestore Database
1. Vá para "Firestore Database" > "Criar banco de dados"
2. Escolha "Modo de teste" inicialmente
3. Escolha a localização mais próxima (ex: us-central1)
4. Após criar, vá para "Regras" e cole o conteúdo de `firestore.rules`

### 1.4 Configurar Storage
1. Vá para "Storage" > "Começar"
2. Escolha "Modo de teste" inicialmente
3. Escolha a localização (mesma do Firestore)
4. Após criar, vá para "Regras" e cole o conteúdo de `storage.rules`

## 2. Configuração do Cliente

### 2.1 Adicionar App Web
1. No console Firebase, clique no ícone da web
2. Digite o nome do app: "Sereno Web App"
3. Ative o Firebase Hosting (opcional)
4. Copie a configuração

### 2.2 Configurar Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

### 2.3 Atualizar firebase.js
Certifique-se de que o arquivo `src/firebase.js` está configurado corretamente:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

## 3. Estrutura do Banco de Dados

### 3.1 Coleções Principais

#### users
- `uid`: string (ID do usuário)
- `email`: string
- `displayName`: string
- `username`: string
- `photoURL`: string (opcional)
- `bio`: string (opcional)
- `role`: 'cliente' | 'psicologo' | 'admin'
- `isVerified`: boolean
- `createdAt`: timestamp
- `postCount`: number
- `likedPosts`: string[] (IDs dos posts curtidos)
- `followers`: string[]
- `following`: string[]

#### posts
- `id`: string
- `userId`: string (ID do autor)
- `author`: string (nome do autor)
- `content`: string
- `isAnonymous`: boolean
- `mood`: object (opcional)
- `tags`: string[]
- `likes`: number
- `comments`: number
- `shares`: number
- `createdAt`: timestamp
- `communityId`: string (opcional)

#### comments
- `id`: string
- `postId`: string
- `userId`: string
- `author`: string
- `content`: string
- `likes`: number
- `createdAt`: timestamp
- `parentCommentId`: string (opcional, para respostas)

#### communities
- `id`: string
- `name`: string
- `description`: string
- `memberCount`: number
- `postCount`: number
- `createdBy`: string
- `isPrivate`: boolean
- `tags`: string[]
- `rules`: string[]

#### notifications
- `id`: string
- `type`: string
- `recipientId`: string
- `senderId`: string
- `postId`: string (opcional)
- `createdAt`: timestamp
- `read`: boolean

### 3.2 Índices Necessários

Crie os seguintes índices compostos no Firestore:

1. **posts**: `communityId` (Ascending) + `createdAt` (Descending)
2. **posts**: `userId` (Ascending) + `createdAt` (Descending)
3. **comments**: `postId` (Ascending) + `createdAt` (Descending)
4. **notifications**: `recipientId` (Ascending) + `createdAt` (Descending)

## 4. Regras de Segurança

### 4.1 Firestore
- Usuários só podem ler/editar seus próprios dados
- Posts são públicos para usuários autenticados
- Comentários são públicos para usuários autenticados
- Apenas proprietários podem editar/deletar seus posts/comentários

### 4.2 Storage
- Usuários só podem fazer upload de arquivos para suas próprias pastas
- Validação de tipo e tamanho de arquivo
- Imagens limitadas a 5MB
- Arquivos gerais limitados a 10MB

## 5. Funcionalidades Implementadas

### 5.1 Sistema de Posts
- ✅ Criação de posts com texto, humor e tags
- ✅ Posts anônimos
- ✅ Sistema de curtidas
- ✅ Sistema de comentários
- ✅ Edição e exclusão de posts

### 5.2 Sistema de Usuários
- ✅ Autenticação com email/senha
- ✅ Perfis de usuário
- ✅ Configurações de privacidade
- ✅ Sistema de seguidores (preparado)

### 5.3 Sistema de Comunidades
- ✅ Criação de comunidades
- ✅ Posts em comunidades
- ✅ Sistema de moderação (preparado)

### 5.4 Sistema de Notificações
- ✅ Notificações de curtidas
- ✅ Notificações de comentários
- ✅ Sistema de leitura

## 6. Deploy das Regras

### 6.1 Firestore Rules
```bash
firebase deploy --only firestore:rules
```

### 6.2 Storage Rules
```bash
firebase deploy --only storage
```

## 7. Testes

### 7.1 Testar Autenticação
1. Crie uma conta de teste
2. Faça login/logout
3. Verifique se as rotas protegidas funcionam

### 7.2 Testar Posts
1. Crie um post
2. Teste curtidas
3. Teste comentários
4. Teste edição/exclusão

### 7.3 Testar Segurança
1. Tente acessar dados de outros usuários
2. Tente editar posts de outros usuários
3. Verifique se as regras estão funcionando

## 8. Monitoramento

### 8.1 Firebase Console
- Monitore o uso do Firestore
- Verifique logs de erro
- Monitore autenticação

### 8.2 Logs de Erro
Implemente logging de erros no cliente para debug:

```javascript
// Em hooks e componentes
try {
  // operação
} catch (error) {
  console.error('Erro na operação:', error);
  // Log para serviço de monitoramento
}
```

## 9. Próximos Passos

### 9.1 Funcionalidades Futuras
- Sistema de mensagens privadas
- Grupos de terapia
- Relatórios de humor
- Sistema de conquistas
- Analytics avançados

### 9.2 Otimizações
- Implementar cache offline
- Otimizar queries
- Implementar paginação infinita
- Sistema de busca avançado

## 10. Suporte

Para dúvidas ou problemas:
1. Verifique os logs do console
2. Teste as regras de segurança
3. Verifique a configuração do Firebase
4. Consulte a documentação oficial do Firebase

---

**Nota**: Este é um projeto em desenvolvimento. As regras de segurança e funcionalidades podem ser ajustadas conforme necessário.
