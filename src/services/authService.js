import axiosInstance from '../api/axiosIstance';

export const loginUser = (email, password) => {
  return axiosInstance.post('/auth/login', { email, password });
};

export const registerUser = (userData) => {
  return axiosInstance.post('/auth/register', userData);
};


export const forgotPassword = (email) => {
  return axiosInstance.post('/auth/forgot-password', { email });
};


export const checkEmailExists = (email) => {
  return axiosInstance.post('/auth/check-email', { email });
};


export const changePassword = (passwords) => {
  return axiosInstance.post('/auth/change-password', passwords);
};



import { deleteToken } from '../store/tokenservice';

export const logout = async () => {
  try {
    // 1. Supprimer le token du Keychain
    await deleteToken();

    return true;
  } catch (error) {
    console.log('Erreur logout:', error);
    return false;
  }
};