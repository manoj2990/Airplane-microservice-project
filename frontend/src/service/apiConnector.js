

import axios from "axios"

export const axiosInstance = axios.create({
    timeout: 10000, // 10 seconds timeout
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add request interceptor for debugging
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

// Add response interceptor for debugging
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
    console.log("apiconnector method -->",method)
     console.log("apiconnector url -->",url)
      console.log("apiconnector bodyData -->",bodyData)
       console.log("apiconnector headers -->",headers)
        console.log("apiconnector params -->",params)

    return axiosInstance({
        method:`${method}`,
        url:`${url}`,
        data: bodyData ? bodyData : null,
        headers: headers ? headers: null,
        params: params ? params : null,
    });
}