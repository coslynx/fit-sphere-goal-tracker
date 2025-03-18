import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { exponentialBackoff } from 'exponential-backoff';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001', // Provide a default value
    timeout: 10000, // Adjust as needed
    headers: {
        'Content-Type': 'application/json',
    },
});

// Sanitize request data
const sanitizeData = (data) => {
    if (typeof data === 'string') {
        return data.replace(/<[^>]*>?/gm, ''); // Remove HTML tags
    }
    if (typeof data === 'object' && data !== null) {
        const sanitized = {};
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                if (typeof data[key] === 'string') {
                    sanitized[key] = data[key].replace(/<[^>]*>?/gm, '');
                } else {
                    sanitized[key] = data[key]; // Keep other types as is
                }
            }
        }
        return sanitized;
    }
    return data;
};

// Validate response data
const validateResponseData = (data) => {
    if (typeof data === 'string') {
        return typeof data === 'string'; // Expecting a string
    }
    if (typeof data === 'object' && data !== null) {
        return typeof data === 'object'; // Expecting an object
    }
    if (typeof data === 'number') {
        return typeof data === 'number'; // Expecting a number
    }

    if (Array.isArray(data)) {
        return Array.isArray(data); // Expecting an array
    }

    return false;
};

// Request interceptor to add JWT token
api.interceptors.request.use(
    (config) => {
        const auth = useAuth();
        const token = auth?.token;

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        if (config.data) {
            config.data = sanitizeData(config.data);
        }
        if (config.params) {
            config.params = sanitizeData(config.params);
        }

        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors and token refresh
api.interceptors.response.use(
    (response) => {
        if (response.data && !validateResponseData(response.data)) {
            console.warn('Response data type validation failed. Returning safe variant.');
            return response; // Return the original response even if validation fails, proceed with least harmful data
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Mock token refresh implementation for MVP
            try {
                // Simulate token refresh with a resolved promise.
                console.warn('Attempting to refresh token (mock implementation)');
                // localStorage.setItem('authToken','MOCK_NEW_TOKEN')
                // const new_token = localStorage.getItem('authToken');

                // const auth = useAuth();
                // auth?.login(new_token,auth.user)

                // originalRequest.headers['Authorization'] = `Bearer ${new_token}`;
                // return api(originalRequest);

                return new Promise((resolve) => {
                    setTimeout(() => {
                        console.warn('Token successfully refreshed! (mock)');

                        // localStorage.setItem('authToken','MOCK_NEW_TOKEN')
                        // const new_token = localStorage.getItem('authToken');
                        // originalRequest.headers['Authorization'] = `Bearer ${new_token}`;
                        // resolve(api(originalRequest));

                        resolve(api(originalRequest));
                    }, 1000);
                });

                // originalRequest.headers['Authorization'] = `Bearer ${new_token}`;
                // return api(originalRequest);
            } catch (refreshError) {
                console.warn('Failed to refresh token (mock)');
                // Handle refresh failure (e.g., redirect to login)
                return Promise.reject(error); // Reject with the original error.
            }
        }

        let errorMessage = 'API Error';
        let errorData = null;

        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('API Error:', error.response.status, error.response.data);
            errorMessage = error.response.data?.message || `Request failed with status ${error.response.status}`;
            errorData = error.response.data?.data || null;
        } else if (error.request) {
            // The request was made but no response was received
            console.error('API Error: No response received');
            errorMessage = 'No response received from the server';
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('API Error:', error.message);
            errorMessage = error.message;
        }

        const apiError = {
            status: error.response?.status || 500,
            message: errorMessage,
            data: errorData,
        };

        return Promise.reject(apiError);
    }
);

const fetchDataWithRetry = async (operation) => {
    const config = {
        retries: 3,
        factor: 2,
        minTimeout: 1000,
        maxTimeout: 10000,
        randomize: true,
    };

    try {
        return await exponentialBackoff(operation, config);
    } catch (err) {
        console.error('Failed all retry attempts', err);
        throw err;
    }
};

const get = async (url, params = {}) => {
    try {
        const response = await fetchDataWithRetry(() => api.get(url, { params }));
        return response.data;
    } catch (error) {
        throw error;
    }
};

const post = async (url, data = {}) => {
    try {
        const response = await fetchDataWithRetry(() => api.post(url, data));
        return response.data;
    } catch (error) {
        throw error;
    }
};

const put = async (url, data = {}) => {
    try {
        const response = await fetchDataWithRetry(() => api.put(url, data));
        return response.data;
    } catch (error) {
        throw error;
    }
};

const del = async (url) => {
    try {
        const response = await fetchDataWithRetry(() => api.delete(url));
        return response.data;
    } catch (error) {
        throw error;
    }
};

export { get, post, put, del };