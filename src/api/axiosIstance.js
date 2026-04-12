import axios from 'axios';
import { getToken } from '../store/tokenservice';

const api = axios.create({
baseURL: 'http://10.161.171.24:3000/api',
//baseURL: 'http://10.0.2.2:3000/api',


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
    // Handle 401 globally
    if (error.response?.status === 401) {
      try {
        await deleteToken();
        console.log('Token expiré, déconnexion automatique...');
      } catch (delErr) {
        console.error('Logout error:', delErr);
      }
    }
    
    // Let caller handle other errors via handleError
    return Promise.reject(error);
  }
);

export default api;
