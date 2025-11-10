import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchSummary } from "../store/slices/analytics";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#2563eb","#f59e0b","#10b981","#22c55e","#ef4444"];

export default function Analytics(){
  const dispatch = useAppDispatch();
  const { summary, loading } = useAppSelector(s=>s.analytics);
  useEffect(()=>{dispatch(fetchSummary());},[dispatch]);
  const data = (summary?.byStatus || []).map((s:any)=>({ name: s.status, value: s.count }));
  return (
    <div className="space-y-6">
      <h1 className="title">Analytics</h1>
      {loading && <div>Loading...</div>}
      {summary && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card">
            <div className="text-sm text-muted">Total Leads</div>
            <div className="text-2xl font-semibold">{summary.totalLeads}</div>
          </div>
          <div className="card h-[320px]">
            <div className="mb-2 font-medium">By Status</div>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data} dataKey="value" nameKey="name" innerRadius={50}>
                    {data.map((entry:any, index:number) => (<Cell key={`c-${index}`} fill={COLORS[index % COLORS.length]} />))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
