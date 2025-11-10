import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../lib/api";

type State = { summary?: any; loading: boolean };
const initial: State = { loading: false };

export const fetchSummary = createAsyncThunk("analytics/summary", async ()=>{
  const { data } = await api.get("/analytics/summary"); return data;
});

const slice = createSlice({
  name: "analytics",
  initialState: initial,
  reducers: {},
  extraReducers: (b)=>{
    b.addCase(fetchSummary.pending,(s)=>{s.loading=true;})
     .addCase(fetchSummary.fulfilled,(s,a)=>{s.loading=false; s.summary=a.payload;});
  }
});
export default slice.reducer;
