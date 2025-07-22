import axios from 'axios';
import { store } from '../store/store.js';
//import { store } from './../store/store';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api',
    
    headers: {
        'Content-Type': 'application/json',
    }
});



// Add a request interceptor to handle token

apiClient.interceptors.request.use(
    (config) => {
        const token = store.getState().auth.token;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export default apiClient; 