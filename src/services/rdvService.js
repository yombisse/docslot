// src/services/rendezvousService.js
import axiosInstance from '../api/axiosIstance';

// Récupérer tous les rendez-vous
export const getAllRendezvous = () => {
  return axiosInstance.get('/rendezvous');
};

// Récupérer mes rendez-vous (patient connecté)
export const getMyRendezvous = (view = 'agenda') => {
  return axiosInstance.get(`/rendezvous/myrdv?view=${view}`);
};
// Récupérer un rendez-vous par ID
export const getRendezvousById = (id) => {
  return axiosInstance.get(`/rendezvous/${id}`);
};

// Créer un rendez-vous
export const createRendezvous = (rdvData) => {
  return axiosInstance.post('/rendezvous', rdvData);
};

// CONFIRMER RDV (juste ID)
export const confirmRendezvous = (id) => {
  return axiosInstance.put(`/rendezvous/${id}/confirm`);
};

// ANNULER RDV (juste ID)
export const cancelRendezvous = (id) => {
  return axiosInstance.put(`/rendezvous/${id}/cancel`);
};