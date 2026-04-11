import { Alert, Platform } from 'react-native';
import { logError } from './errorLogger';

export const handleError = async (error, context = {}) => {
  console.error('Global error handler:', error, context);

  let message = 'Une erreur inattendue est survenue. Réessayez dans un instant.';
  let type = 'UNKNOWN';

  if (error.response) {
    // API/Server error
    const status = error.response.status;
    message = error.response.data?.message || 
              error.response.data?.error || 
              `Erreur du serveur (code ${status})`;
    type = status >= 500 ? 'SERVER' : 
           (status >= 400 ? 'VALIDATION' : 'API');
  } else if (error.request) {
    // Network error
    message = 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.';
    type = 'NETWORK';
  } else {
    // Client/JS error
    message = error.message || message;
    type = 'CLIENT';
  }

  const errorData = { 
    message, 
    type, 
    stack: error.stack, 
    context,
    rawError: error.toString() 
  };

  // Log to backend
  await logError(errorData);

  // User feedback
  Alert.alert('Erreur', message);

  return { success: false, error: message, type };
};

// For input/saisie validation errors (synchronous)
export const handleValidationError = (errorMsg, fieldContext = {}) => {
  const errorData = { 
    message: errorMsg, 
    type: 'INPUT', 
    context: { ...fieldContext, source: 'validation' } 
  };
  logError(errorData);
  Alert.alert('Erreur de saisie', errorMsg);
  return { success: false, error: errorMsg, type: 'INPUT' };
};

