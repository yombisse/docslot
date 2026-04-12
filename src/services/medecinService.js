import axiosInstance from '../api/axiosIstance';
import { handleError } from '../utils/errorHandler';

// Tous les médecins
export const getAllMedecins = async () => {
  try {
    const response = await axiosInstance.get('/medecins');
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error, { service: 'medecinService', method: 'getAllMedecins' });
  }
};

// Médecins disponibles
export const getAllMedecinsDisponibles = async () => {
  try {
    const response = await axiosInstance.get('/medecins/available');
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error, { service: 'medecinService', method: 'getAllMedecinsDisponibles' });
  }
};

// Détails d'un médecin
export const getMedecinById = async (id) => {
  try {
    const response = await axiosInstance.get(`/medecins/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error, { service: 'medecinService', method: 'getMedecinById', params: { id } });
  }
};

// Créneaux disponibles d'un médecin
export const getCreneauxByMedecin = async (id_medecin) => {
  try {
    const response = await axiosInstance.get(`/medecins/${id_medecin}/slots`);
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error, { service: 'medecinService', method: 'getCreneauxByMedecin', params: { id_medecin } });
  }
};

// Créer un médecin
export const createMedecin = async (medecinData) => {
  try {
    const response = await axiosInstance.post('/medecins', medecinData);
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error, { service: 'medecinService', method: 'createMedecin', params: medecinData });
  }
};

// Mettre à jour un médecin
export const updateMedecin = async (id, medecinData) => {
  try {
    const response = await axiosInstance.put(`/medecins/${id}`, medecinData);
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error, { service: 'medecinService', method: 'updateMedecin', params: { id, ...medecinData } });
  }
};

// Supprimer un médecin
export const deleteMedecin = async (id) => {
  try {
    const response = await axiosInstance.delete(`/medecins/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error, { service: 'medecinService', method: 'deleteMedecin', params: { id } });
  }
};

