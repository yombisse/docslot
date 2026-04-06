import axiosInstance from '../api/axiosIstance';

// Récupérer tous les utilisateurs
export const getAllUsers = () => {
  return axiosInstance.get('/users');
};

// Récupérer un utilisateur par ID
export const getUserById = (id) => {
  return axiosInstance.get(`/users/${id}`);
};

// Créer un nouvel utilisateur
export const createUser = (userData) => {
  return axiosInstance.post('/users', userData);
};

// Mettre à jour un utilisateur
export const updateUser = (id, userData) => {
  return axiosInstance.put(`/users/${id}`, userData);
};

// Supprimer un utilisateur
export const deleteUser = (id) => {
  return axiosInstance.delete(`/users/${id}`);
};