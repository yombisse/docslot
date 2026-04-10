import axiosInstance from '../api/axiosIstance';

// Récupérer les notifications du patient connecté
export const getNotifications = () => {
  return axiosInstance.get('/patients/notifications');
};
