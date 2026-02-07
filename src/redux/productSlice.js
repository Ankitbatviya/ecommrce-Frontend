import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunk to fetch products from API
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  try {
    const response = await axios.get('https://ecommrce-backend-1.onrender.com/api/products');

    return response.data.data || []; // Return the array of products
  } catch (error) {
    console.error('Error fetching products:', error);

    // Throw error so Redux can handle it properly
    throw new Error(error.response?.data?.message || 'Failed to fetch products');
  }
});
const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    lastFetched: null, // Timestamp for cache invalidation
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.lastFetched = Date.now(); // Mark when we cached this
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default productSlice.reducer;