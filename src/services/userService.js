import axiosInstance from '../api/axiosIstance';

// Récupérer tous les utilisateurs
export const getAllUsers = () => {
  return axiosInstance.get('/users');
};

// Récupérer un utilisateur par ID
export const getUserById = (id) => {
  return axiosInstance.get(`/users/${id}`);
};
// Récupérer un le profile de l'utilisateur connectee  
export const getProfile = () => {
  return axiosInstance.get("/users/profile");
};

// Créer un nouvel utilisateur
export const createUser = (userData) => {
  return axiosInstance.post('/users', userData);
};
// userService.ts
export const updateUser = (userData) => {
  return axiosInstance.put('/users', userData);
};
// Supprimer un utilisateur
export const deleteUser = (id) => {
  return axiosInstance.delete(`/users/${id}`);
};


//  Stats principales dashboard admin
export const getAdminStats = () => {
  return axiosInstance.get('/admin/stats');
};

// Stats détaillées des rendez-vous
export const getRdvStats = () => {
  return axiosInstance.get('/admin/rdv-stats');
};