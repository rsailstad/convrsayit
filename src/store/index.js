import { configureStore } from '@reduxjs/toolkit';
import activitiesReducer from './activitiesSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    activities: activitiesReducer,
    auth: authReducer,
  },
});

export default store; 