// src/services/medecinService.js
import axiosInstance from '../api/axiosIstance';

// Récupérer tous les médecins
export const getAllMedecins = () => {
  return axiosInstance.get('/medecins');
};


// Récupérer tous les médecins disponnibles
export const getAllMedecinsDisponibles = () => {
  return axiosInstance.get('/medecins/available');
};

// Récupérer un médecin par ID
export const getMedecinById = (id) => {
  return axiosInstance.get(`/medecins/${id}`);
};

// Créer un médecin
export const createMedecin = (medecinData) => {
  return axiosInstance.post('/medecins', medecinData);
};

// Mettre à jour un médecin
export const updateMedecin = (id, medecinData) => {
  return axiosInstance.put(`/medecins/${id}`, medecinData);
};

// Supprimer un médecin
export const deleteMedecin = (id) => {
  return axiosInstance.delete(`/medecins/${id}`);
};