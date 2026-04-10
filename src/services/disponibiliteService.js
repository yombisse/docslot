import axiosInstance from '../api/axiosIstance';

// Récupérer mes disponibilités (médecin connecté)
export const getMyDisponibilites = () => {
  return axiosInstance.get('/disponibilites/mine');
};

// Voir disponibilités d'un médecin pour prise RDV
export const getDisponibilitesMedecin = (idMedecin) => {
  return axiosInstance.get(`/disponibilites/medecin/${idMedecin}`);
};

// Créer une disponibilité
export const createDisponibilite = (dispoData) => {
  return axiosInstance.post('/disponibilites', dispoData);
};

// Modifier une disponibilité
export const updateDisponibilite = (id, dispoData) => {
  return axiosInstance.put(`/disponibilites/${id}`, dispoData);
};

// Annuler (soft delete) une disponibilité
export const annulerDisponibilite = (id) => {
  return axiosInstance.put(`/disponibilites/annuler/${id}`);
};
