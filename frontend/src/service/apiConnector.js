

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
        console.log('Making request to:', config.url);
        console.log('Request method:', config.method);
        console.log('Request data:', config.data);
        console.log('Request params:', config.params);
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
        console.log('Response received:', response.status, response.data);
        return response;
    },
    (error) => {
        console.error('Response error:', error.response?.status, error.response?.data);
        console.error('Error message:', error.message);
        return Promise.reject(error);
    }
);

export const apiConnector = (method, url, bodyData, headers, params) => {
    try {
        console.log("apiconnector method -->",method)
        console.log("apiconnector url -->",url)
        console.log("apiconnector bodyData -->",bodyData)
        console.log("apiconnector headers -->",headers)
        console.log("apiconnector params -->",params)

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