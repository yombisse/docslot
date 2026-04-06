// src/services/disponibiliteService.js
import axiosInstance from '../api/axiosIstance';

// Récupérer mes disponibilités (médecin connecté)
export const getMyDisponibilites = () => {
  return axiosInstance.get('/disponibilites/mine');
};

// Créer une disponibilité
export const createDisponibilite = (dispoData) => {
  return axiosInstance.post('/disponibilites', dispoData);
};

// Supprimer une disponibilité
export const deleteDisponibilite = (id) => {
  return axiosInstance.delete(`/disponibilites/${id}`);
};