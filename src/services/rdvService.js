import axiosInstance from '../api/axiosIstance';
import { handleError } from '../utils/errorHandler';

// Récupérer tous les rendez-vous
export const getAllRendezvous = async () => {
  try {
    const response = await axiosInstance.get('/rendezvous');
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error, { service: 'rdvService', method: 'getAllRendezvous' });
  }
};

// Récupérer mes rendez-vous (patient connecté)
export const getMyRendezvous = async (view = 'agenda') => {
  try {
    const response = await axiosInstance.get(`/rendezvous/myrdv?view=${view}`);
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error, { service: 'rdvService', method: 'getMyRendezvous', params: { view } });
  }
};

// Récupérer un rendez-vous par ID
export const getRendezvousById = async (id) => {
  try {
    const response = await axiosInstance.get(`/rendezvous/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error, { service: 'rdvService', method: 'getRendezvousById', params: { id } });
  }
};

// Créer un rendez-vous
export const createRendezvous = async (rdvData) => {
  try {
    const response = await axiosInstance.post('/rendezvous', rdvData);
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error, { service: 'rdvService', method: 'createRendezvous', params: rdvData });
  }
};

// CONFIRMER RDV (juste ID)
export const confirmRendezvous = async (id) => {
  try {
    const response = await axiosInstance.put(`/rendezvous/${id}/confirm`);
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error, { service: 'rdvService', method: 'confirmRendezvous', params: { id } });
  }
};

// ANNULER RDV (juste ID)
export const cancelRendezvous = async (id) => {
  try {
    const response = await axiosInstance.put(`/rendezvous/${id}/cancel`);
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error, { service: 'rdvService', method: 'cancelRendezvous', params: { id } });
  }
};

