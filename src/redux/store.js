import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import productReducer from './productSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    products: productReducer,
  },
});