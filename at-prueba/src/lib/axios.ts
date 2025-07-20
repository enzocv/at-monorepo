import axios from 'axios';
1
const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/`,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor para manejar tokens
axiosInstance.interceptors.request.use(
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

export default axiosInstance; 