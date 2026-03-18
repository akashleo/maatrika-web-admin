import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.ts';
import productsReducer from './slices/productsSlice.ts';
import ordersReducer from './slices/ordersSlice.ts';
import uiReducer from './slices/uiSlice.ts';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    orders: ordersReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
