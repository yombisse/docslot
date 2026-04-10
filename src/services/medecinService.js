import axiosInstance from '../api/axiosIstance';

// 🔎 Tous les médecins
export const getAllMedecins = () => {
  return axiosInstance.get('/medecins');
};

// Médecins disponibles
export const getAllMedecinsDisponibles = () => {
  return axiosInstance.get('/medecins/available');
};

// Détails d’un médecin
export const getMedecinById = (id) => {
  return axiosInstance.get(`/medecins/${id}`);
};

// créneaux disponibles d’un médecin
export const getCreneauxByMedecin = (id_medecin) => {
  return axiosInstance.get(`/medecins/${id_medecin}/slots`);
};

// ➕ Créer un médecin
export const createMedecin = (medecinData) => {
  return axiosInstance.post('/medecins', medecinData);
};

// Mettre à jour un médecin
export const updateMedecin = (id, medecinData) => {
  return axiosInstance.put(`/medecins/${id}`, medecinData);
};

//Supprimer un médecin
export const deleteMedecin = (id) => {
  return axiosInstance.delete(`/medecins/${id}`);
};