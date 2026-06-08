import axios from 'axios';

const API = axios.create({
    baseURL: 'http://127.0.0.1:8000', 
});

// Request interceptor to automatically add the Bearer token to headers
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token expiry or invalidation (401 Unauthorized)
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Do not redirect/clear storage if the error is from the login request
            const isLoginRequest = error.config?.url?.includes('/auth/login');
            if (!isLoginRequest) {
                localStorage.removeItem('token');
                localStorage.removeItem('userName');
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);

export default API;