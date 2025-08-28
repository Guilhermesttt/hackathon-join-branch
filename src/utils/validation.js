// Validation utilities for forms and user input

export const validators = {
  // Email validation
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email é obrigatório';
    if (!emailRegex.test(email)) return 'Email inválido';
    return null;
  },

  // Password validation
  password: (password) => {
    if (!password) return 'Senha é obrigatória';
    if (password.length < 6) return 'Senha deve ter pelo menos 6 caracteres';
    if (password.length > 128) return 'Senha muito longa';
    return null;
  },

  // Username validation
  username: (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!username) return 'Username é obrigatório';
    if (!usernameRegex.test(username)) {
      return 'Username deve ter 3-20 caracteres (apenas letras, números e _)';
    }
    return null;
  },

  // Display name validation
  displayName: (name) => {
    if (!name) return 'Nome é obrigatório';
    if (name.length < 2) return 'Nome deve ter pelo menos 2 caracteres';
    if (name.length > 50) return 'Nome muito longo';
    return null;
  },

  // Phone validation
  phone: (phone) => {
    if (!phone) return null; // Optional field
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    if (!phoneRegex.test(phone)) {
      return 'Formato inválido. Use: (11) 99999-9999';
    }
    return null;
  },

  // Birth date validation
  birthDate: (date) => {
    if (!date) return 'Data de nascimento é obrigatória';
    
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    
    if (birthDate > today) {
      return 'Data de nascimento não pode ser no futuro';
    }
    
    if (age < 13) {
      return 'Você deve ter pelo menos 13 anos';
    }
    
    if (age > 120) {
      return 'Data de nascimento inválida';
    }
    
    return null;
  },

  // Post content validation
  postContent: (content) => {
    if (!content) return 'Conteúdo é obrigatório';
    if (content.trim().length < 10) return 'Post deve ter pelo menos 10 caracteres';
    if (content.length > 1000) return 'Post muito longo (máximo 1000 caracteres)';
    return null;
  },

  // Bio validation
  bio: (bio) => {
    if (!bio) return null; // Optional field
    if (bio.length > 200) return 'Biografia muito longa (máximo 200 caracteres)';
    return null;
  },

  // URL validation
  url: (url) => {
    if (!url) return null; // Optional field
    try {
      new URL(url);
      return null;
    } catch {
      return 'URL inválida';
    }
  },

  // Tags validation
  tags: (tags) => {
    if (!Array.isArray(tags)) return 'Tags devem ser um array';
    if (tags.length > 10) return 'Máximo 10 tags permitidas';
    
    for (const tag of tags) {
      if (typeof tag !== 'string') return 'Tags devem ser strings';
      if (tag.length < 2) return 'Tags devem ter pelo menos 2 caracteres';
      if (tag.length > 20) return 'Tags muito longas (máximo 20 caracteres)';
    }
    
    return null;
  },

  // File validation
  file: (file, maxSizeMB = 5, allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']) => {
    if (!file) return 'Arquivo é obrigatório';
    
    if (!allowedTypes.includes(file.type)) {
      return `Tipo de arquivo não permitido. Tipos aceitos: ${allowedTypes.join(', ')}`;
    }
    
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `Arquivo muito grande. Tamanho máximo: ${maxSizeMB}MB`;
    }
    
    return null;
  }
};

// Form validation helper
export const validateForm = (data, rules) => {
  const errors = {};
  
  for (const [field, value] of Object.entries(data)) {
    if (rules[field]) {
      const error = rules[field](value);
      if (error) {
        errors[field] = error;
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Sanitize user input to prevent XSS
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .trim();
};

// Format phone number
export const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone;
};

// Validate CRP for psychologists
export const validateCRP = (crp) => {
  if (!crp) return 'CRP é obrigatório para psicólogos';
  
  const crpRegex = /^\d{2}\/\d{5}$/;
  if (!crpRegex.test(crp)) {
    return 'Formato inválido. Use: 06/12345';
  }
  
  return null;
};

export default {
  validators,
  validateForm,
  sanitizeInput,
  formatPhoneNumber,
  validateCRP
};