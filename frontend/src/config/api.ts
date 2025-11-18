import axios from 'axios';

// Backend API base URL
// Use relative path for development (goes through Vite proxy)
// Use absolute URL for production
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    config.headers = {
      ...config.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    return config;
  },
  (error) => Promise.reject(error)
);


// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;