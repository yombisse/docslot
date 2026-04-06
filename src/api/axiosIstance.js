import axios from 'axios';
import { getToken } from '../store/tokenservice';

const api = axios.create({
  baseURL: 'http://172.23.196.24:3000/api',
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await deleteToken();
      console.log('Token expiré, déconnexion...');
    }
    return Promise.reject(error);
  }
);

export default api;
