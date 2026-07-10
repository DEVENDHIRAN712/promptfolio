import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token from localStorage or state
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('promptfolio_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if unauthorized and not already on auth page
      if (window.location.pathname.startsWith('/dashboard')) {
        localStorage.removeItem('promptfolio_token');
        localStorage.removeItem('promptfolio_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
