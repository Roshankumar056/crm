import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { toast } from 'sonner';

interface Activity {
  id: string;
  type: 'NOTE' | 'CALL' | 'MEETING' | 'EMAIL';
  content: string;
  leadId: string;
  userId: string;
  user: {
    name: string;
    email: string;
  };
  createdAt: string;
}

interface ActivitiesState {
  activities: Activity[];
  loading: boolean;
  error: string | null;
}

const initialState: ActivitiesState = {
  activities: [],
  loading: false,
  error: null,
};

export const fetchActivities = createAsyncThunk(
  'activities/fetchActivities',
  async (leadId: string) => {
    const { data } = await api.get(`/activities?leadId=${leadId}`);
    return data;
  }
);

export const createActivity = createAsyncThunk(
  'activities/createActivity',
  async (activityData: any) => {
    const { data } = await api.post('/activities', activityData);
    toast.success('Activity added successfully');
    return data;
  }
);

const activitiesSlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    addActivity: (state, action) => {
      state.activities.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch activities';
      })
      .addCase(createActivity.fulfilled, (state, action) => {
        state.activities.unshift(action.payload);
      });
  },
});

export const { addActivity } = activitiesSlice.actions;
export default activitiesSlice.reducer;
