import axiosInstance from '../api/axiosIstance';
import { handleError } from '../utils/errorHandler';

// Récupérer tous les patients
export const getAllPatients = async () => {
  try {
    const response = await axiosInstance.get('/patients');
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error, { service: 'patientService', method: 'getAllPatients' });
  }
};

// Récupérer un patient par ID
export const getPatientById = async (id) => {
  try {
    const response = await axiosInstance.get(`/patients/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error, { service: 'patientService', method: 'getPatientById', params: { id } });
  }
};

// Créer un nouveau patient
export const createPatient = async (patientData) => {
  try {
    const response = await axiosInstance.post('/patients', patientData);
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error, { service: 'patientService', method: 'createPatient', params: patientData });
  }
};

// Mettre à jour un patient
export const updatePatient = async (id, patientData) => {
  try {
    const response = await axiosInstance.put(`/patients/${id}`, patientData);
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error, { service: 'patientService', method: 'updatePatient', params: { id, ...patientData } });
  }
};

// Supprimer un patient
export const deletePatient = async (id) => {
  try {
    const response = await axiosInstance.delete(`/patients/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error, { service: 'patientService', method: 'deletePatient', params: { id } });
  }
};

