import axiosInstance from '../api/axiosIstance';
import { handleError } from '../utils/errorHandler';
import { deleteToken } from '../store/tokenservice';

export const loginUser = async (email, password) => {
  try {
    const response = await axiosInstance.post('/auth/login', { email, password });
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error, { service: 'authService', method: 'loginUser', params: { email } });
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/auth/register', userData);
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error, { service: 'authService', method: 'registerUser' });
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post('/auth/forgot-password', { email });
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error, { service: 'authService', method: 'forgotPassword', params: { email } });
  }
};

export const checkEmailExists = async (email) => {
  try {
    const response = await axiosInstance.post('/auth/check-email', { email });
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error, { service: 'authService', method: 'checkEmailExists', params: { email } });
  }
};

export const changePassword = async (passwords) => {
  try {
    const response = await axiosInstance.post('/auth/change-password', passwords);
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error, { service: 'authService', method: 'changePassword' });
  }
};

export const logout = async () => {
  try {
    await deleteToken();
    logError({ type: 'LOGOUT_SUCCESS', message: 'User logged out' });
    return { success: true };
  } catch (error) {
    return handleError(error, { service: 'authService', method: 'logout' });
  }
};

