
import axios from 'axios';
import {store} from '../src/store/store.js';

// Fetch the API base URL from environment variables
const baseURL = import.meta.env.VITE_API_BASE_URL;


// Create an Axios instance
const apiClient = axios.create({
  baseURL,
  timeout: 10000, // Set a timeout limit
});

apiClient.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    // const token = localStorage.getItem('authToken'); // Retrieve token from local storage or any other storage
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