
import axios from 'axios';
import {store} from '../store/store.js';
import { logout } from '../store/slices/authSlice.js';

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

// Add a response interceptor to handle 401 errors
apiClient.interceptors.response.use(
    (response) => {
        // Return successful responses as-is
        return response;
    },
    (error) => {
        console.log('API error:', error);
        // Check if error is 401 Unauthorized
        if (error.response && error.response.status === 401) {
            // Clear auth state from Redux store
            store.dispatch(logout());
            
            // Redirect to login page
            // Use window.location to ensure complete navigation
            window.location.href = '/';
            
            // Optional: Show a message to user (you can customize this)
            console.log('Session expired. Please log in again.');
        }
        
        // Return the error for other status codes
        return Promise.reject(error);
    }
);


export default apiClient;