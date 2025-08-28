# 🔥 Configuração do Firebase Storage

## 📋 Pré-requisitos

1. **Firebase CLI instalado**: `npm install -g firebase-tools`
2. **Projeto Firebase configurado** com Storage habilitado
3. **Regras de Storage** configuradas corretamente

## 🚀 Passos para Configuração

### 1. Fazer Login no Firebase
```bash
firebase login
```

### 2. Selecionar o Projeto
```bash
firebase use hackathon-8b0e1
```

### 3. Fazer Deploy das Regras de Storage
```bash
firebase deploy --only storage
```

### 4. Configurar CORS (Opcional, mas recomendado)

#### Opção A: Via Firebase Console
1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Selecione seu projeto
3. Vá para **Storage** > **Rules**
4. Clique em **CORS** e configure:
   - **Origin**: `*` (ou seu domínio específico)
   - **Methods**: `GET, POST, PUT, DELETE, HEAD`
   - **Headers**: `Content-Type, Access-Control-Allow-Origin`

#### Opção B: Via Script (Avançado)
1. Instale dependências: `npm install @google-cloud/storage`
2. Crie uma service account key no Firebase Console
3. Execute: `node setup-storage-cors.js`

## 📁 Estrutura de Arquivos no Storage

```
users/
├── {userId}/
│   ├── profile-{timestamp}.jpg
│   └── banner-{timestamp}.jpg
```

## 🔒 Regras de Segurança

As regras já estão configuradas em `storage.rules`:

- **Leitura**: Qualquer usuário autenticado
- **Escrita**: Apenas o próprio usuário
- **Tamanho máximo**: 5MB por imagem
- **Tipos permitidos**: Apenas imagens

## 🧪 Testando o Upload

1. **Faça login** na aplicação
2. **Complete o perfil** com uma foto
3. **Verifique o console** para logs de upload
4. **Confirme no Firebase Console** que a imagem foi salva

## 🐛 Solução de Problemas

### Erro de CORS
- Verifique se as regras de storage foram deployadas
- Configure CORS no Firebase Console
- Verifique se o domínio está permitido

### Erro de Permissão
- Verifique se o usuário está autenticado
- Confirme se as regras de storage estão corretas
- Verifique se o arquivo não excede 5MB

### Erro de Upload
- Verifique a conexão com a internet
- Confirme se o arquivo é uma imagem válida
- Verifique os logs no console do navegador

## 📱 Funcionalidades Implementadas

✅ **Upload de foto de perfil** (circular)
✅ **Upload de banner** (retangular)
✅ **Preview em tempo real**
✅ **Validação de arquivos**
✅ **Barra de progresso**
✅ **Armazenamento no Firebase Storage**
✅ **URLs salvos no Firestore**
✅ **Regras de segurança configuradas**

## 🔄 Próximos Passos

1. **Testar upload** de diferentes tipos de imagem
2. **Implementar compressão** de imagens
3. **Adicionar suporte** para múltiplos formatos
4. **Implementar cache** de imagens
5. **Adicionar edição** de imagens existentes
