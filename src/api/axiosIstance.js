import axios from 'axios';
import { getToken, deleteToken } from '../store/tokenservice';


const api = axios.create({
baseURL: 'http://10.185.138.24:3000/api',
//baseURL: 'http://10.0.2.2:3000/api',
// baseURL: 'http://13.38.44.177/api',


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
