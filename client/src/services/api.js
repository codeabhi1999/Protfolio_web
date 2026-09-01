import axios from 'axios';

// Configure Axios Instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Crucial for cookie passing
  timeout: 2000, // Drop requests if taking too long to load fast
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
