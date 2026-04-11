import axiosInstance from '../api/axiosIstance';
import { getToken } from '../store/tokenservice';

export const logError = async (errorInfo) => {
  try {
    const token = await getToken();
    await axiosInstance.post('/errors', {
      ...errorInfo,
      token: token || null,
      timestamp: new Date().toISOString(),
      app_version: '1.0.0',
      platform: 'react-native',
    });
    console.log('Error logged to backend');
  } catch (logErr) {
    console.error('Failed to log error to backend:', logErr);
  }
};

