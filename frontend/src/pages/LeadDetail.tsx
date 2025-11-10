import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store";
import { assignLead, getLead, updateLead } from "../store/slices/leads";
import { addActivity, fetchActivities } from "../store/slices/activities";
import { fetchUsers } from "../store/slices/users";

export default function LeadDetail(){
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { current } = useAppSelector(s=>s.leads);
  const { items:users } = useAppSelector(s=>s.users);
  const { items:activities } = useAppSelector(s=>s.activities);
  const { user } = useAppSelector(s=>s.auth);
  const [status,setStatus] = useState("NEW");
  const [ownerId,setOwnerId] = useState<string>("");
  const [note,setNote] = useState("");

  useEffect(()=>{
    if(!id) return;
    dispatch(getLead(id));
    dispatch(fetchActivities(id));
    dispatch(fetchUsers());
  },[id,dispatch]);

  useEffect(()=>{ if(current?.status) setStatus(current.status); if(current?.owner?.id) setOwnerId(current.owner.id); },[current]);

  if(!current) return <div>Loading...</div>;

  const canAssign = user?.role === "ADMIN" || user?.role === "MANAGER";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="title">{current.name}</h1>
        <div className="text-sm text-muted">Lead ID: {current.id}</div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card space-y-3">
          <div className="font-medium">Status</div>
          <select className="input" value={status} onChange={e=>setStatus(e.target.value)}>
            {["NEW","CONTACTED","QUALIFIED","WON","LOST"].map(s=>(<option key={s} value={s}>{s}</option>))}
          </select>
          <button className="btn btn-primary w-full" onClick={()=>{
            if(!id) return;
            dispatch(updateLead({id, payload:{ status }}));
          }}>Update Status</button>
        </div>

        <div className="card space-y-3">
          <div className="font-medium">Assign Owner</div>
          <select className="input" value={ownerId} onChange={e=>setOwnerId(e.target.value)} disabled={!canAssign}>
            <option value="">Unassigned</option>
            {users.filter(u=>u.role!=="ADMIN").map(u=>(<option key={u.id} value={u.id}>{u.name} — {u.role}</option>))}
          </select>
          <button className="btn btn-ghost w-full" disabled={!canAssign} onClick={()=>{
            if(!id || !ownerId) return;
            dispatch(assignLead({id, ownerId}));
          }}>Assign</button>
          {!canAssign && <div className="text-xs text-muted">Only Admin/Manager can assign leads.</div>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <div className="font-medium mb-3">Activity Timeline</div>
          <div className="space-y-3 max-h-[360px] overflow-auto pr-2">
            {activities.map(a=>(
              <div key={a.id} className="flex items-start gap-3">
                <div className="h-2 w-2 mt-2 rounded-full bg-brand-600"></div>
                <div>
                  <div className="text-sm font-medium">{a.type}</div>
                  {a.note && <div className="text-sm text-muted">{a.note}</div>}
                  <div className="text-xs text-muted">{new Date(a.at).toLocaleString()}</div>
                </div>
              </div>
            ))}
            {activities.length===0 && <div className="text-sm text-muted">No activities yet.</div>}
          </div>
        </div>

        <div className="card space-y-3">
          <div className="font-medium">Add Activity</div>
          <select className="input" id="type">
            {["NOTE","CALL","MEETING"].map(t=>(<option key={t} value={t}>{t}</option>))}
          </select>
          <textarea className="input h-28" placeholder="Write a note..." value={note} onChange={e=>setNote(e.target.value)} />
          <button className="btn btn-primary w-full" onClick={()=>{
            const type = (document.getElementById("type") as HTMLSelectElement).value;
            if(!id) return;
            dispatch(addActivity({ leadId: id, type, note }));
            setNote("");
          }}>Add</button>
        </div>
      </div>
    </div>
  )
}
