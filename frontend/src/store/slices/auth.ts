import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../lib/api";
import toast from "react-hot-toast";

type User = { id: string; email: string; name: string; role: "ADMIN"|"MANAGER"|"SALES" };
type State = { user?: User; token?: string; loading: boolean; error?: string };
const initial: State = { loading: false };

export const login = createAsyncThunk("auth/login", async (payload: { email: string; password: string }) => {
  const { data } = await api.post("/auth/login", payload);
  return data as { user: User; tokens: { accessToken: string } };
});

const slice = createSlice({
  name: "auth",
  initialState: initial,
  reducers: {
    logout: (s) => { s.user = undefined; s.token = undefined; toast.success("Logged out"); }
  },
  extraReducers: (b) => {
    b.addCase(login.pending, (s)=>{s.loading=true; s.error=undefined;})
     .addCase(login.fulfilled, (s,a)=>{s.loading=false; s.user=a.payload.user; s.token=a.payload.tokens.accessToken; toast.success(`Welcome, ${a.payload.user.name}`);})
     .addCase(login.rejected, (s,a)=>{s.loading=false; s.error=a.error.message; toast.error("Invalid credentials");});
  }
});

export const { logout } = slice.actions;
export default slice.reducer;
