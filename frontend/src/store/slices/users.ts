import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../lib/api";

type User = { id: string; email: string; name: string; role: string };
type State = { items: User[]; loading: boolean };
const initial: State = { items: [], loading: false };

export const fetchUsers = createAsyncThunk("users/list", async ()=>{
  const { data } = await api.get("/users"); return data.users as User[];
});

const slice = createSlice({
  name: "users",
  initialState: initial,
  reducers: {},
  extraReducers: (b)=>{
    b.addCase(fetchUsers.pending,(s)=>{s.loading=true;})
     .addCase(fetchUsers.fulfilled,(s,a)=>{s.loading=false; s.items=a.payload;});
  }
});
export default slice.reducer;
