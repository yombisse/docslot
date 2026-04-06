// src/services/patientService.js
import axiosInstance from '../api/axiosIstance';

// Récupérer tous les patients
export const getAllPatients = () => {
  return axiosInstance.get('/patients');
};

// Récupérer un patient par ID
export const getPatientById = (id) => {
  return axiosInstance.get(`/patients/${id}`);
};

// Créer un nouveau patient
export const createPatient = (patientData) => {
  return axiosInstance.post('/patients', patientData);
};

// Mettre à jour un patient
export const updatePatient = (id, patientData) => {
  return axiosInstance.put(`/patients/${id}`, patientData);
};

// Supprimer un patient
export const deletePatient = (id) => {
  return axiosInstance.delete(`/patients/${id}`);
};