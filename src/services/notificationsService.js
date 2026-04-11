import api from "../api/axiosIstance";


export const getAllNotifications = () =>
  api.get('/notifications');

export const getUnreadCount = () =>
  api.get('/notifications/unread-count');

export const getMyNotifications = () =>
  api.get('/notifications/me');

export const markAsRead = (id) =>
  api.put(`/notifications/${id}/read`);