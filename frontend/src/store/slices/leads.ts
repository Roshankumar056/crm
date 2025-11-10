import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../lib/api";
import toast from "react-hot-toast";

export type Lead = { id: string; name: string; status: "NEW"|"CONTACTED"|"QUALIFIED"|"WON"|"LOST"; value?: number; owner?: any; };
type State = { items: Lead[]; current?: any; loading: boolean; error?: string };
const initial: State = { items: [], loading: false };

export const fetchLeads = createAsyncThunk("leads/list", async ()=>{
  const { data } = await api.get("/leads"); return data.leads as Lead[];
});
export const getLead = createAsyncThunk("leads/get", async (id: string)=>{
  const { data } = await api.get(`/leads/${id}`); return data.lead;
});
export const createLead = createAsyncThunk("leads/create", async (payload: any)=>{
  const { data } = await api.post("/leads", payload); return data.lead;
});
export const updateLead = createAsyncThunk("leads/update", async ({id, payload}:{id:string; payload:any})=>{
  const { data } = await api.patch(`/leads/${id}`, payload); return data.lead;
});
export const assignLead = createAsyncThunk("leads/assign", async ({id, ownerId}:{id:string; ownerId:string})=>{
  const { data } = await api.post(`/leads/${id}/assign`, { ownerId }); return data.lead;
});

const slice = createSlice({
  name: "leads",
  initialState: initial,
  reducers: {},
  extraReducers: (b)=>{
    b.addCase(fetchLeads.pending,(s)=>{s.loading=true;})
     .addCase(fetchLeads.fulfilled,(s,a)=>{s.loading=false; s.items=a.payload;})
     .addCase(getLead.fulfilled,(s,a)=>{s.current=a.payload;})
     .addCase(createLead.fulfilled,(s,a)=>{s.items.unshift(a.payload); toast.success("Lead created");})
     .addCase(updateLead.fulfilled,(s,a)=>{s.current=a.payload; s.items=s.items.map(i=>i.id===a.payload.id?a.payload:i); toast.success("Lead updated");})
     .addCase(assignLead.fulfilled,(s,a)=>{s.current=a.payload; s.items=s.items.map(i=>i.id===a.payload.id?a.payload:i); toast.success("Lead assigned");});
  }
});
export default slice.reducer;
