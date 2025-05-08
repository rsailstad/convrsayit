import { configureStore } from '@reduxjs/toolkit';
import activitiesReducer from './activitiesSlice';

const store = configureStore({
  reducer: {
    activities: activitiesReducer,
  },
});

export default store; 