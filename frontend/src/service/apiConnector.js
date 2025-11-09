

import axios from "axios"

// Create axios instance with timeout and default headers
export const axiosInstance = axios.create({
    timeout: 10000, // 10 seconds timeout
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add request interceptor for error handling
axiosInstance.interceptors.request.use(
    (config) => {
    
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
    (response) => {

        return response;
    },
    (error) => {
     ;
        return Promise.reject(error);
    }
);

export const apiConnector = (method, url, bodyData, headers, params) => {
    try {
  

        // Validate required parameters
        if (!method || !url) {
            throw new Error('Method and URL are required parameters');
        }

        // Ensure method is uppercase
        const validMethod = method.toUpperCase();

        return axiosInstance({
            method: validMethod,
            url: url,
            data: bodyData ? bodyData : null,
            headers: headers ? headers : null,
            params: params ? params : null,
        }).catch((error) => {
            // Enhanced error handling
            if (error.response) {
                // Server responded with error status
                throw error;
            } else if (error.request) {
                // Request made but no response
                throw new Error('Network error: No response from server. Please check your connection.');
            } else {
                // Error in request setup
                throw new Error(`Request error: ${error.message}`);
            }
        });
    } catch (error) {
        console.error('apiConnector error:', error);
        return Promise.reject(error);
    }
}