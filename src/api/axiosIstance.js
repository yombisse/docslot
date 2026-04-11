import axios from 'axios';
import { getToken } from '../store/tokenservice';

const api = axios.create({
 baseURL: 'http://10.161.171.24:3000/api',
//baseURL: 'http://10.17.108.21:3000/api',

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
