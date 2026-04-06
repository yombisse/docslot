// src/services/rendezvousService.js
import axiosInstance from '../api/axiosIstance';

// Récupérer tous les rendez-vous
export const getAllRendezvous = () => {
  return axiosInstance.get('/rendezvous');
};

// Récupérer mes rendez-vous (patient connecté)
export const getMyRendezvous = () => {
  return axiosInstance.get('/rendezvous/myrdv');
};

// Récupérer un rendez-vous par ID
export const getRendezvousById = (id) => {
  return axiosInstance.get(`/rendezvous/${id}`);
};

// Créer un rendez-vous
export const createRendezvous = (rdvData) => {
  return axiosInstance.post('/rendezvous', rdvData);
};

// Confirmer un rendez-vous
export const confirmRendezvous = (id, data) => {
  return axiosInstance.put(`/rendezvous/${id}/confirm`, data);
};

// Annuler un rendez-vous
export const cancelRendezvous = (id, data) => {
  return axiosInstance.put(`/rendezvous/${id}/cancel`, data);
};