import { useToast } from './ToastContext';

let toastContext = null;

export const setToastContext = (context) => {
  toastContext = context;
};

export const handleError = async (error, context = {}) => {
  // LOG UNIQUEMENT EN MODE DEV (visible dans Metro / PC)
  if (__DEV__) {
    console.log('Global error handler:', {
      error: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
      context,
    });
  }

  let message =
    'Une erreur inattendue est survenue. Réessayez dans un instant.';
  let toastType = 'error';

  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    message =
      data?.errors?.general ||
      Object.values(data?.errors || {})[0] ||
      data?.message ||
      data?.error ||
      'Une erreur est survenue. Veuillez réessayer.';

    toastType = status >= 500 ? 'error' : 'warning';
  } else if (error.request) {
    message =
      'Impossible de se connecter au serveur. Vérifiez votre connexion internet.';
    toastType = 'error';
  } else {
    message = error.message || message;
    toastType = 'error';
  }

  // TOAST UNIQUEMENT (aucun log sur téléphone)
  if (toastContext?.showToast) {
    toastContext.showToast(message, toastType, 4000);
  }

  return {
    success: false,
    error: message,
    type: toastType,
  };
};

export const handleValidationError = (errorMsg, fieldContext = {}) => {
  // LOG DEV ONLY
  if (__DEV__) {
    console.warn('Validation error:', {
      message: errorMsg,
      context: fieldContext,
    });
  }

  if (toastContext?.showToast) {
    toastContext.showToast(errorMsg, 'warning', 3000);
  }

  return {
    success: false,
    error: errorMsg,
    type: 'warning',
  };
};

export const showSuccessToast = (message) => {
  if (toastContext?.showToast) {
    toastContext.showToast(message, 'success', 3000);
  }
};

export const showInfoToast = (message) => {
  if (toastContext?.showToast) {
    toastContext.showToast(message, 'info', 3000);
  }
};