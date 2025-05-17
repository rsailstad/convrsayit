import { configureStore } from '@reduxjs/toolkit';
import activitiesReducer from './activitiesSlice';
import authReducer from './authSlice';
import subscriptionReducer from './subscriptionSlice';

export const store = configureStore({
  reducer: {
    activities: activitiesReducer,
    auth: authReducer,
    subscription: subscriptionReducer,
  },
});

export default store; 