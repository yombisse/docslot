import axiosInstance from '../api/axiosIstance';
import { handleError } from '../utils/errorHandler';

export const getAllNotifications = async () => {
  try {
    const response = await axiosInstance.get('/notifications');
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error, { service: 'notificationsService', method: 'getAllNotifications' });
  }
};

export const getUnreadCount = async () => {
  try {
    const response = await axiosInstance.get('/notifications/unread-count');
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error, { service: 'notificationsService', method: 'getUnreadCount' });
  }
};

export const getMyNotifications = async () => {
  try {
    const response = await axiosInstance.get('/notifications/me');
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error, { service: 'notificationsService', method: 'getMyNotifications' });
  }
};

export const markAsRead = async (id) => {
  try {
    const response = await axiosInstance.put(`/notifications/${id}/read`);
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error, { service: 'notificationsService', method: 'markAsRead', params: { id } });
  }
};

