import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://karigar-pk-xuea.onrender.com/api',
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('karigarUser'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
