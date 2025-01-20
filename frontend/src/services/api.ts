import axios, { AxiosInstance } from 'axios';
import { getEnv } from '../config/env';

const BACKEND_BASE_URL = getEnv("VITE_BACKEND_BASE_URL", 'http://localhost:8080');

export const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: BACKEND_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      // Add any default headers here
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      // You can add common logic here, such as:
      // - Adding authentication tokens
      // - Logging
      // - Request transformation
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      // You can transform response data here if needed
      return response;
    },
    (error) => {
      // Handle common error cases
      if (error.response?.status === 401) {
        // Handle unauthorized access
        console.error('Unauthorized access');
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Create a singleton instance
export const api = createApiInstance();

