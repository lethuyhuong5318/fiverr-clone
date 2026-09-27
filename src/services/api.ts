import axios, { AxiosError } from 'axios';
import { STORAGE, ROUTES } from '@/utils/constants';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  config.headers.set('TokenCybersoft', import.meta.env.VITE_TOKEN_CYBERSOFT);
  const token = localStorage.getItem(STORAGE.token);
  if (token) config.headers.set('Authorization', `Bearer ${token}`);
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (
      error.response?.status === 401 &&
      !window.location.pathname.startsWith(ROUTES.signIn)
    ) {
      localStorage.removeItem(STORAGE.token);
      window.location.assign(ROUTES.signIn);
    }
    return Promise.reject(error);
  },
);

export default api;
