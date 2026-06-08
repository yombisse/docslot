import React, { createContext, useContext, useState, ReactNode } from 'react';
import Toast from '../componnents/Toast';

interface ToastContextType {
  showToast: (message: string, type?: 'error' | 'success' | 'info' | 'warning', duration?: number) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastData {
  message: string;
  type: 'error' | 'success' | 'info' | 'warning';
  visible: boolean;
  duration: number;
}

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastData>({
    message: '',
    type: 'error',
    visible: false,
    duration: 5000,
  });

  const showToast = (message: string, type: 'error' | 'success' | 'info' | 'warning' = 'error', duration: number = 5000) => {
    setToast({
      message,
      type,
      visible: true,
      duration,
    });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
        duration={toast.duration}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
