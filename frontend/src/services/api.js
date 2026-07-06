import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// Attach JWT token automatically to every request if it exists
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers = req.headers || {};
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;