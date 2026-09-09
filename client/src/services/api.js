import axios from 'axios';

// Resolve Base URL dynamically: in production (Vercel), always default to relative '/api'
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (import.meta.env.PROD) {
    if (!envUrl || envUrl.includes('localhost') || envUrl.includes('127.0.0.1')) {
      return '/api';
    }
    return envUrl;
  }
  return envUrl || 'http://localhost:5001/api';
};

// Configure Axios Instance
const API = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true, // Crucial for cookie passing
  timeout: 15000, // 15s to allow serverless cold starts
});

// Request interceptor to attach authentication token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to catch unauthorized states
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the server rejects credentials as unauthorized, log out the admin session locally
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      // If we are in the admin dashboard path, redirect to login
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
