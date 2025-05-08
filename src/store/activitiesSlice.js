import { createSlice } from '@reduxjs/toolkit';

const activitiesSlice = createSlice({
  name: 'activities',
  initialState: {
    selectedActivities: [],
  },
  reducers: {
    selectActivity: (state, action) => {
      if (state.selectedActivities.length < 10 && !state.selectedActivities.find(sa => sa.id === action.payload.id)) {
        state.selectedActivities.push(action.payload);
      }
    },
    deselectActivity: (state, action) => {
      state.selectedActivities = state.selectedActivities.filter(activity => activity.id !== action.payload);
    },
  },
});

export const { selectActivity, deselectActivity } = activitiesSlice.actions;
export default activitiesSlice.reducer; 