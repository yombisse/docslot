import axiosInstance from '../api/axiosIstance';
import { handleError } from '../utils/errorHandler';

// Récupérer tous les utilisateurs
export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get('/users');
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error, { service: 'userService', method: 'getAllUsers' });
  }
};

// Récupérer un utilisateur par ID
export const getUserById = async (id) => {
  try {
    const response = await axiosInstance.get(`/users/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error, { service: 'userService', method: 'getUserById', params: { id } });
  }
};

// Récupérer le profile de l'utilisateur connecté  
export const getProfile = async () => {
  try {
    const response = await axiosInstance.get("/users/profile");
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error, { service: 'userService', method: 'getProfile' });
  }
};

// Créer un nouvel utilisateur
export const createUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/users', userData);
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error, { service: 'userService', method: 'createUser', params: userData });
  }
};

export const updateUser = async (userData) => {
  try {
    const response = await axiosInstance.put('/users', userData);
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error, { service: 'userService', method: 'updateUser', params: userData });
  }
};

// Supprimer un utilisateur
export const deleteUser = async (id) => {
  try {
    const response = await axiosInstance.delete(`/users/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error, { service: 'userService', method: 'deleteUser', params: { id } });
  }
};

// Stats principales dashboard admin
export const getAdminStats = async () => {
  try {
    const response = await axiosInstance.get('/admin/stats');
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error, { service: 'userService', method: 'getAdminStats' });
  }
};

// Stats détaillées des rendez-vous
export const getRdvStats = async () => {
  try {
    const response = await axiosInstance.get('/admin/rdv-stats');
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error, { service: 'userService', method: 'getRdvStats' });
  }
};

