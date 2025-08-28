import { auth } from '../firebase';

// Verificar se o usuário está autenticado
export const isAuthenticated = () => {
  return auth.currentUser !== null;
};

// Verificar se o usuário tem permissão para acessar um recurso
export const hasPermission = (requiredRole) => {
  const user = auth.currentUser;
  if (!user) return false;
  
  // Aqui você pode implementar lógica mais complexa de permissões
  // Por exemplo, verificar roles no Firestore
  return true;
};

// Verificar se o usuário é o proprietário de um recurso
export const isOwner = (resourceUserId) => {
  const user = auth.currentUser;
  if (!user) return false;
  
  return user.uid === resourceUserId;
};

// Verificar se o usuário pode editar um recurso
export const canEdit = (resourceUserId, resourceType = 'post') => {
  const user = auth.currentUser;
  if (!user) return false;
  
  // Usuário pode editar se for o proprietário
  if (isOwner(resourceUserId)) return true;
  
  // Aqui você pode adicionar lógica para moderadores/admins
  // Por exemplo, verificar se o usuário tem role de moderador
  
  return false;
};

// Verificar se o usuário pode deletar um recurso
export const canDelete = (resourceUserId, resourceType = 'post') => {
  const user = auth.currentUser;
  if (!user) return false;
  
  // Usuário pode deletar se for o proprietário
  if (isOwner(resourceUserId)) return true;
  
  // Aqui você pode adicionar lógica para moderadores/admins
  
  return false;
};

// Validar entrada do usuário para prevenir XSS
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remover tags HTML perigosas
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .trim();
};

// Validar email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validar username
export const isValidUsername = (username) => {
  // Username deve ter entre 3 e 20 caracteres, apenas letras, números, pontos e underscores
  const usernameRegex = /^[a-zA-Z0-9._]{3,20}$/;
  return usernameRegex.test(username);
};

// Validar conteúdo do post
export const isValidPostContent = (content) => {
  if (!content || typeof content !== 'string') return false;
  
  const trimmedContent = content.trim();
  
  // Conteúdo deve ter pelo menos 10 caracteres
  if (trimmedContent.length < 10) return false;
  
  // Conteúdo não pode ter mais de 1000 caracteres
  if (trimmedContent.length > 1000) return false;
  
  return true;
};

// Validar tags
export const isValidTags = (tags) => {
  if (!Array.isArray(tags)) return false;
  
  // Máximo de 5 tags
  if (tags.length > 5) return false;
  
  // Cada tag deve ter entre 2 e 20 caracteres
  return tags.every(tag => {
    if (typeof tag !== 'string') return false;
    const trimmedTag = tag.trim();
    return trimmedTag.length >= 2 && trimmedTag.length <= 20;
  });
};

// Rate limiting para criação de posts
export const checkRateLimit = (action = 'post', userId) => {
  // Implementar lógica de rate limiting
  // Por exemplo, verificar se o usuário criou muitos posts em um período curto
  
  // Por enquanto, retorna true (sem limite)
  return true;
};

// Verificar se o usuário pode criar posts anônimos
export const canCreateAnonymousPost = (userId) => {
  // Implementar lógica para verificar se o usuário pode criar posts anônimos
  // Por exemplo, verificar se o usuário tem conta verificada
  
  return true;
};

// Verificar se o usuário pode comentar
export const canComment = (userId, postId) => {
  // Implementar lógica para verificar se o usuário pode comentar
  // Por exemplo, verificar se o usuário não está bloqueado
  
  return true;
};

// Verificar se o usuário pode curtir
export const canLike = (userId, postId) => {
  // Implementar lógica para verificar se o usuário pode curtir
  // Por exemplo, verificar se o usuário não está bloqueado
  
  return true;
};
