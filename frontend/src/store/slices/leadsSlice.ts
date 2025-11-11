import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { toast } from 'sonner';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL' | 'WON' | 'LOST';
  source: string;
  value: number;
  assignedToId: string | null;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface LeadsState {
  leads: Lead[];
  selectedLead: Lead | null;
  loading: boolean;
  error: string | null;
}

const initialState: LeadsState = {
  leads: [],
  selectedLead: null,
  loading: false,
  error: null,
};

export const fetchLeads = createAsyncThunk('leads/fetchLeads', async () => {
  const { data } = await api.get('/leads');
  return Array.isArray(data) ? data : [];
});

export const createLead = createAsyncThunk('leads/createLead', async (leadData: any) => {
  const { data } = await api.post('/leads', leadData);
  toast.success('Lead created successfully');
  return data;
});

export const updateLead = createAsyncThunk(
  'leads/updateLead',
  async ({ id, ...updates }: any) => {
    const { data } = await api.put(`/leads/${id}`, updates);
    toast.success('Lead updated successfully');
    return data;
  }
);

export const assignLead = createAsyncThunk(
  'leads/assignLead',
  async ({ id, userId }: { id: string; userId: string }) => {
    const { data } = await api.post(`/leads/${id}/assign`, { userId });
    toast.success('Lead assigned successfully');
    return data;
  }
);

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    setSelectedLead: (state, action) => {
      state.selectedLead = action.payload;
    },
    addLead: (state, action) => {
      if (!Array.isArray(state.leads)) state.leads = [];
      state.leads.unshift(action.payload);
    },
    updateLeadInList: (state, action) => {
      if (!Array.isArray(state.leads)) state.leads = [];
      const index = state.leads.findIndex((l) => l.id === action.payload.id);
      if (index !== -1) {
        state.leads[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch leads';
      })
      .addCase(createLead.fulfilled, (state, action) => {
        if (!Array.isArray(state.leads)) state.leads = [];
        state.leads.unshift(action.payload);
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        if (!Array.isArray(state.leads)) state.leads = [];
        const index = state.leads.findIndex((l) => l.id === action.payload.id);
        if (index !== -1) {
          state.leads[index] = action.payload;
        }
        if (state.selectedLead?.id === action.payload.id) {
          state.selectedLead = action.payload;
        }
      })
      .addCase(assignLead.fulfilled, (state, action) => {
        if (!Array.isArray(state.leads)) state.leads = [];
        const index = state.leads.findIndex((l) => l.id === action.payload.id);
        if (index !== -1) {
          state.leads[index] = action.payload;
        }
      });
  },
});

export const { setSelectedLead, addLead, updateLeadInList } = leadsSlice.actions;
export default leadsSlice.reducer;
