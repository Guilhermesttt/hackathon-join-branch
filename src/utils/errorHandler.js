// Centralized error handling utilities

export class AppError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR', details = null) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date();
  }
}

export const errorCodes = {
  // Authentication errors
  AUTH_USER_NOT_FOUND: 'AUTH_USER_NOT_FOUND',
  AUTH_WRONG_PASSWORD: 'AUTH_WRONG_PASSWORD',
  AUTH_EMAIL_ALREADY_IN_USE: 'AUTH_EMAIL_ALREADY_IN_USE',
  AUTH_WEAK_PASSWORD: 'AUTH_WEAK_PASSWORD',
  AUTH_INVALID_EMAIL: 'AUTH_INVALID_EMAIL',
  AUTH_TOO_MANY_REQUESTS: 'AUTH_TOO_MANY_REQUESTS',
  
  // Firestore errors
  FIRESTORE_PERMISSION_DENIED: 'FIRESTORE_PERMISSION_DENIED',
  FIRESTORE_NOT_FOUND: 'FIRESTORE_NOT_FOUND',
  FIRESTORE_ALREADY_EXISTS: 'FIRESTORE_ALREADY_EXISTS',
  FIRESTORE_UNAVAILABLE: 'FIRESTORE_UNAVAILABLE',
  
  // Storage errors
  STORAGE_UNAUTHORIZED: 'STORAGE_UNAUTHORIZED',
  STORAGE_QUOTA_EXCEEDED: 'STORAGE_QUOTA_EXCEEDED',
  STORAGE_INVALID_FORMAT: 'STORAGE_INVALID_FORMAT',
  STORAGE_FILE_TOO_LARGE: 'STORAGE_FILE_TOO_LARGE',
  
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  NETWORK_TIMEOUT: 'NETWORK_TIMEOUT',
  
  // Validation errors
  VALIDATION_REQUIRED_FIELD: 'VALIDATION_REQUIRED_FIELD',
  VALIDATION_INVALID_FORMAT: 'VALIDATION_INVALID_FORMAT',
  VALIDATION_TOO_LONG: 'VALIDATION_TOO_LONG',
  VALIDATION_TOO_SHORT: 'VALIDATION_TOO_SHORT'
};

export const errorMessages = {
  [errorCodes.AUTH_USER_NOT_FOUND]: 'Usuário não encontrado',
  [errorCodes.AUTH_WRONG_PASSWORD]: 'Senha incorreta',
  [errorCodes.AUTH_EMAIL_ALREADY_IN_USE]: 'Este email já está em uso',
  [errorCodes.AUTH_WEAK_PASSWORD]: 'Senha muito fraca',
  [errorCodes.AUTH_INVALID_EMAIL]: 'Email inválido',
  [errorCodes.AUTH_TOO_MANY_REQUESTS]: 'Muitas tentativas. Tente novamente mais tarde',
  
  [errorCodes.FIRESTORE_PERMISSION_DENIED]: 'Você não tem permissão para esta ação',
  [errorCodes.FIRESTORE_NOT_FOUND]: 'Dados não encontrados',
  [errorCodes.FIRESTORE_ALREADY_EXISTS]: 'Este item já existe',
  [errorCodes.FIRESTORE_UNAVAILABLE]: 'Serviço temporariamente indisponível',
  
  [errorCodes.STORAGE_UNAUTHORIZED]: 'Não autorizado para upload',
  [errorCodes.STORAGE_QUOTA_EXCEEDED]: 'Cota de armazenamento excedida',
  [errorCodes.STORAGE_INVALID_FORMAT]: 'Formato de arquivo inválido',
  [errorCodes.STORAGE_FILE_TOO_LARGE]: 'Arquivo muito grande',
  
  [errorCodes.NETWORK_ERROR]: 'Erro de conexão. Verifique sua internet',
  [errorCodes.NETWORK_TIMEOUT]: 'Timeout na conexão',
  
  [errorCodes.VALIDATION_REQUIRED_FIELD]: 'Este campo é obrigatório',
  [errorCodes.VALIDATION_INVALID_FORMAT]: 'Formato inválido',
  [errorCodes.VALIDATION_TOO_LONG]: 'Texto muito longo',
  [errorCodes.VALIDATION_TOO_SHORT]: 'Texto muito curto'
};

// Convert Firebase errors to app errors
export const convertFirebaseError = (error) => {
  const firebaseToAppCode = {
    'auth/user-not-found': errorCodes.AUTH_USER_NOT_FOUND,
    'auth/wrong-password': errorCodes.AUTH_WRONG_PASSWORD,
    'auth/email-already-in-use': errorCodes.AUTH_EMAIL_ALREADY_IN_USE,
    'auth/weak-password': errorCodes.AUTH_WEAK_PASSWORD,
    'auth/invalid-email': errorCodes.AUTH_INVALID_EMAIL,
    'auth/too-many-requests': errorCodes.AUTH_TOO_MANY_REQUESTS,
    
    'permission-denied': errorCodes.FIRESTORE_PERMISSION_DENIED,
    'not-found': errorCodes.FIRESTORE_NOT_FOUND,
    'already-exists': errorCodes.FIRESTORE_ALREADY_EXISTS,
    'unavailable': errorCodes.FIRESTORE_UNAVAILABLE,
    
    'storage/unauthorized': errorCodes.STORAGE_UNAUTHORIZED,
    'storage/quota-exceeded': errorCodes.STORAGE_QUOTA_EXCEEDED,
    'storage/invalid-format': errorCodes.STORAGE_INVALID_FORMAT,
    'storage/file-too-large': errorCodes.STORAGE_FILE_TOO_LARGE
  };

  const appCode = firebaseToAppCode[error.code] || 'UNKNOWN_ERROR';
  const message = errorMessages[appCode] || error.message || 'Erro desconhecido';
  
  return new AppError(message, appCode, {
    originalError: error,
    firebaseCode: error.code
  });
};

// Global error handler
export const handleError = (error, context = 'general') => {
  console.error(`Error in ${context}:`, error);
  
  let appError;
  
  if (error instanceof AppError) {
    appError = error;
  } else if (error.code) {
    // Firebase error
    appError = convertFirebaseError(error);
  } else {
    // Generic error
    appError = new AppError(
      error.message || 'Erro inesperado',
      'UNKNOWN_ERROR',
      { originalError: error }
    );
  }
  
  // Log error for monitoring (in production, send to error tracking service)
  logError(appError, context);
  
  return appError;
};

// Error logging function
const logError = (error, context) => {
  const errorLog = {
    message: error.message,
    code: error.code,
    context,
    timestamp: error.timestamp,
    userAgent: navigator.userAgent,
    url: window.location.href,
    userId: null, // Will be set by auth context if available
    details: error.details
  };
  
  // In development, just log to console
  if (import.meta.env.DEV) {
    console.error('Error Log:', errorLog);
  } else {
    // In production, send to error tracking service
    // Example: Sentry, LogRocket, etc.
    console.error('Production Error:', errorLog);
  }
};

// Error boundary helper
export const withErrorBoundary = (Component, fallback = null) => {
  return class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
      const appError = handleError(error, 'ErrorBoundary');
      console.error('Error Boundary caught an error:', appError, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        if (fallback) {
          return fallback;
        }
        
        return (
          <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="bg-white/10 border border-red-500/30 rounded-xl p-6 max-w-md w-full text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-400 text-2xl">⚠️</span>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Algo deu errado
              </h2>
              <p className="text-white/70 mb-4">
                Ocorreu um erro inesperado. Tente recarregar a página.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors"
              >
                Recarregar Página
              </button>
            </div>
          </div>
        );
      }

      return <Component {...this.props} />;
    }
  };
};

// Async error handler for promises
export const handleAsync = (asyncFn) => {
  return async (...args) => {
    try {
      return await asyncFn(...args);
    } catch (error) {
      throw handleError(error, asyncFn.name || 'async');
    }
  };
};

// Retry mechanism for failed operations
export const withRetry = async (operation, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw handleError(error, 'retry');
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError;
};

export default {
  AppError,
  errorCodes,
  errorMessages,
  convertFirebaseError,
  handleError,
  withErrorBoundary,
  handleAsync,
  withRetry
};