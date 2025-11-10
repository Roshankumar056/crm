import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../lib/api";
import toast from "react-hot-toast";

type Activity = { id: string; type: string; note?: string; at: string; user?: any };
type State = { items: Activity[]; loading: boolean };
const initial: State = { items: [], loading: false };

export const fetchActivities = createAsyncThunk("activities/list", async (leadId: string)=>{
  const { data } = await api.get(`/activities/lead/${leadId}`); return data.activities as Activity[];
});
export const addActivity = createAsyncThunk("activities/add", async (payload: { leadId: string; type: string; note?: string; })=>{
  const { data } = await api.post(`/activities`, payload); return data.activity as Activity;
});

const slice = createSlice({
  name: "activities",
  initialState: initial,
  reducers: {},
  extraReducers: (b)=>{
    b.addCase(fetchActivities.pending,(s)=>{s.loading=true;})
     .addCase(fetchActivities.fulfilled,(s,a)=>{s.loading=false; s.items=a.payload;})
     .addCase(addActivity.fulfilled,(s,a)=>{s.items.unshift(a.payload); toast.success("Activity added");});
  }
});
export default slice.reducer;
