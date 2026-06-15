import axios from 'axios';

const normalizeBaseUrl = (url) => url.replace(/\/+$/, '');

const API_BASE_URL = normalizeBaseUrl(
    import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000' : '/api')
);

// Create Axios instance
const API = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// ===============================
// REQUEST INTERCEPTOR
// Automatically attach JWT token
// ===============================
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

// ===============================
// RESPONSE INTERCEPTOR
// Handle authentication errors
// ===============================
API.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {

            // Prevent logout loop on login page
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

export { API_BASE_URL };
export default API;
