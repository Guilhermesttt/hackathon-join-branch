# Sistema de Imagens no Firestore (Base64)

## 📋 Visão Geral

Este sistema armazena imagens diretamente no Firestore como strings base64, eliminando a necessidade do Firebase Storage. As imagens são convertidas para base64 e armazenadas nos documentos dos usuários.

## 🏗️ Arquitetura

### Estrutura dos Dados no Firestore

```javascript
// Documento do usuário em /users/{userId}
{
  uid: "user123",
  displayName: "João Silva",
  username: "joao_silva",
  bio: "Desenvolvedor apaixonado por tecnologia",
  phone: "(11) 99999-9999",
  birthDate: "1990-01-01",
  
  // Campos de imagem
  profilePhotoId: "profile_user123_1640995200000",
  profilePhotoData: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
  bannerPhotoId: "banner_user123_1640995200000", 
  bannerPhotoData: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
  
  // Metadados
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## 🔧 Configuração

### 1. Regras do Firestore

As regras já estão configuradas para permitir que usuários atualizem seus próprios documentos:

```javascript
match /users/{userId} {
  allow read: if request.auth != null;
  allow write: if request.auth != null && request.auth.uid == userId;
  allow create: if request.auth != null && request.auth.uid == userId;
}
```

### 2. Serviço de Imagens

O `profileImageService.js` gerencia:
- ✅ Conversão de arquivos para base64
- ✅ Validação de tipo e tamanho
- ✅ Upload para Firestore
- ✅ Substituição de imagens existentes
- ✅ Deleção de imagens

## 📁 Estrutura de Arquivos

```
src/
├── services/
│   └── profileImageService.js    # Serviço principal de imagens
├── hooks/
│   └── useImages.js              # Hook para gerenciar estado das imagens
└── Components/
    └── Profile.jsx               # Componente de perfil do usuário
```

## 🚀 Funcionalidades

### Upload de Imagens
- **Foto de Perfil**: Máximo 2MB
- **Banner**: Máximo 5MB
- **Formatos Suportados**: JPEG, PNG, GIF, WebP

### Validações Automáticas
- ✅ Tipo de arquivo
- ✅ Tamanho do arquivo
- ✅ Autenticação do usuário
- ✅ Permissões de acesso

### Gerenciamento Inteligente
- 🔄 Substituição automática de imagens antigas
- 🆔 IDs únicos para cada imagem
- 📅 Timestamps de atualização
- 🗑️ Limpeza automática de dados antigos

## 💾 Vantagens do Sistema Base64

### ✅ **Prós:**
- **Simplicidade**: Apenas Firestore, sem Storage
- **Consistência**: Dados centralizados em um banco
- **Backup**: Imagens incluídas nos backups automáticos
- **Transações**: Operações atômicas com outros dados do usuário
- **Offline**: Funciona com cache offline do Firestore

### ⚠️ **Limitações:**
- **Tamanho**: Base64 aumenta o tamanho em ~33%
- **Performance**: Documentos maiores podem ser mais lentos
- **Custo**: Firestore cobra por documento, não por armazenamento
- **Limite**: Documentos Firestore têm limite de 1MB

## 🔍 Exemplo de Uso

```javascript
import { profileImageService } from '../services/profileImageService';

// Upload de foto de perfil
const handleProfilePhotoUpload = async (file, userId) => {
  try {
    const result = await profileImageService.uploadProfilePhoto(file, userId);
    console.log('Foto enviada com sucesso:', result.imageId);
  } catch (error) {
    console.error('Erro no upload:', error.message);
  }
};

// Obter imagens do usuário
const getUserImages = async (userId) => {
  const images = await profileImageService.getUserImages(userId);
  return {
    profilePhoto: images.profilePhotoURL,
    bannerPhoto: images.bannerPhotoURL
  };
};
```

## 🛠️ Manutenção

### Limpeza de Dados
- Imagens antigas são automaticamente substituídas
- IDs únicos evitam conflitos
- Timestamps permitem rastreamento de mudanças

### Monitoramento
- Logs de erro detalhados
- Validação de arquivos antes do upload
- Tratamento de erros com mensagens amigáveis

## 📊 Métricas Recomendadas

### Monitorar:
- **Tamanho médio dos documentos** de usuário
- **Frequência de atualizações** de imagens
- **Erros de validação** de arquivos
- **Performance** de leitura dos documentos

### Alertas:
- Documentos próximos ao limite de 1MB
- Taxa de erro alta em uploads
- Tempo de resposta lento nas consultas

## 🔮 Futuras Melhorias

1. **Compressão**: Implementar compressão de imagens antes do base64
2. **Cache**: Sistema de cache para imagens frequentemente acessadas
3. **Thumbnails**: Geração automática de miniaturas
4. **CDN**: Integração com CDN para melhor performance
5. **Migração**: Ferramentas para migrar de Storage para Firestore

## 📞 Suporte

Para dúvidas ou problemas:
1. Verificar logs do console do navegador
2. Validar regras do Firestore
3. Testar com arquivos menores
4. Verificar autenticação do usuário

---

**Nota**: Este sistema é ideal para aplicações com usuários que não fazem upload frequente de imagens grandes. Para uso intensivo de imagens, considere migrar para Firebase Storage.
