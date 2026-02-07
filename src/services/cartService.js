// services/cartService.js
import axios from 'axios';
import { getAuthToken } from '../utils/auth';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/`;

// Set up axios instance with auth
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const cartService = {
  // Get user's cart
  getCart: async () => {
    try {
      const response = await axiosInstance.get('/cart');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Add item to cart
  addToCart: async (productId, quantity, size, color) => {
    try {
      const response = await axiosInstance.post('/cart/add', {
        productId,
        quantity,
        size,
        color
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update cart item quantity
  updateCartItem: async (itemId, quantity) => {
    try {
      const response = await axiosInstance.put('/cart/update', {
        itemId,
        quantity
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Remove item from cart
  removeFromCart: async (productId, size, color) => {
    try {
      const response = await axiosInstance.delete('/cart/remove', {
        data: { productId, size, color }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Clear entire cart
  clearCart: async () => {
    try {
      const response = await axiosInstance.delete('/cart/clear');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};