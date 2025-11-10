import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { login } from "../store/slices/auth";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login(){
  const dispatch = useAppDispatch();
  const { token, loading, error } = useAppSelector(s=>s.auth);
  const [email,setEmail] = useState("admin@crm.local");
  const [password,setPassword] = useState("Admin@123");
  if (token) return <Navigate to="/" replace />;
  return (
    <div className="min-h-screen grid place-items-center p-6 bg-gray-50 dark:bg-neutral-900">
      <div className="card w-full max-w-md">
        <h1 className="title mb-2">Sign in</h1>
        <p className="text-sm text-muted mb-6">Use your CRM credentials</p>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted">Email</label>
            <input className="input mt-1" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-muted">Password</label>
            <input type="password" className="input mt-1" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          {error && <div className="text-sm text-red-500">{error}</div>}
          <button className="btn btn-primary w-full" disabled={loading} onClick={()=>dispatch(login({email,password}))}>
            {loading?"Signing in...":"Sign in"}
          </button>
        </div>
      </div>
    </div>
  )
}
