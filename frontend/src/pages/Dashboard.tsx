import { useEffect } from "react";
import { useAppSelector } from "../store";
import { useSocket } from "../lib/useSocket";
import { BarChart3 } from "lucide-react";
import toast from "react-hot-toast";

export default function Dashboard(){
  const { user } = useAppSelector(s=>s.auth);
  const socket = useSocket(user?.id);
  useEffect(()=>{
    if(!socket) return;
    socket.on("lead:new", (d)=>toast.success(`New lead: ${d.lead?.name ?? ''}`));
    socket.on("lead:assigned", (d)=>toast(`Lead assigned: ${d.lead?.name ?? ''}`));
    socket.on("lead:updated", (d)=>toast(`Lead updated: ${d.lead?.name ?? ''} → ${d.lead?.status ?? ''}`));
    socket.on("activity:new", (_)=>toast("New activity added"));
    return ()=>{ socket.off("lead:new"); socket.off("lead:assigned"); socket.off("lead:updated"); socket.off("activity:new"); };
  },[socket]);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="title">Dashboard</h1>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card"><div className="text-muted text-sm">Realtime</div><div className="text-lg font-medium flex items-center gap-2"><BarChart3 size={18}/> Socket connected for {user?.name}</div></div>
        <div className="card"><div className="text-muted text-sm">Role</div><div className="text-lg font-medium">{user?.role}</div></div>
        <div className="card"><div className="text-muted text-sm">Welcome</div><div className="text-lg font-medium">Let’s close some deals 🚀</div></div>
      </div>
    </div>
  )
}
