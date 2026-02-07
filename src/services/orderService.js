// services/orderService.js
import axios from 'axios';
import { getAuthToken } from '../utils/auth';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/`;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

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

// Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access - maybe redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const orderService = {
  // Create new order
  createOrder: async (orderData) => {
    try {
      const response = await axiosInstance.post('/orders/create', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user's orders
  getUserOrders: async () => {
    try {
      const response = await axiosInstance.get('/orders');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user's orders with pagination
  getUserOrdersPaginated: async (page = 1, limit = 10) => {
    try {
      const response = await axiosInstance.get('/orders', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single order
  getOrderById: async (orderId) => {
    try {
      const response = await axiosInstance.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get order by order number
  getOrderByOrderNumber: async (orderNumber) => {
    try {
      const response = await axiosInstance.get(`/orders/number/${orderNumber}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cancel order
  cancelOrder: async (orderId, reason) => {
    try {
      const response = await axiosInstance.put(`/orders/${orderId}/cancel`, { reason });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Track order status
  trackOrder: async (orderId) => {
    try {
      const response = await axiosInstance.get(`/orders/${orderId}/track`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Download invoice
  downloadInvoice: async (orderId) => {
    try {
      const response = await axiosInstance.get(`/orders/${orderId}/invoice`, {
        responseType: 'blob' // Important for file downloads
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Request return/exchange
  requestReturn: async (orderId, returnData) => {
    try {
      const response = await axiosInstance.post(`/orders/${orderId}/return`, returnData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get order statistics
  getOrderStats: async () => {
    try {
      const response = await axiosInstance.get('/orders/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Filter orders by status
  getOrdersByStatus: async (status) => {
    try {
      const response = await axiosInstance.get('/orders', {
        params: { status }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update shipping address
  updateShippingAddress: async (orderId, addressData) => {
    try {
      const response = await axiosInstance.put(`/orders/${orderId}/address`, addressData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Add order notes
  addOrderNotes: async (orderId, notes) => {
    try {
      const response = await axiosInstance.post(`/orders/${orderId}/notes`, { notes });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};