import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { createLead, fetchLeads } from "../store/slices/leads";
import { Link } from "react-router-dom";

function StatusBadge({ s }: { s: string }) {
  const cls = {
    NEW: "badge badge-new",
    CONTACTED: "badge badge-contacted",
    QUALIFIED: "badge badge-qualified",
    WON: "badge badge-won",
    LOST: "badge badge-lost",
  }[s as any] || "badge";
  return <span className={cls}>{s}</span>;
}

export default function Leads() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((s) => s.leads);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [value, setValue] = useState<number | "">("");
  useEffect(() => {
    dispatch(fetchLeads());
  }, [dispatch]);
  const filtered = useMemo(
    () => items.filter((l) => l.name.toLowerCase().includes(q.toLowerCase())),
    [items, q]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="title">Leads</h1>
        <div className="flex gap-2">
          <input
            className="input"
            placeholder="Search leads..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      <div className="card">
        <div className="grid md:grid-cols-4 gap-3">
          <input
            className="input"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="input"
            placeholder="Value"
            value={value}
            onChange={(e) =>
              setValue(e.target.value === "" ? "" : Number(e.target.value))
            }
          />
          <button
            className="btn btn-primary"
            onClick={() => {
              if (!name) return;
              dispatch(
                createLead({
                  name,
                  email,
                  value: value === "" ? undefined : value,
                  status: "NEW",
                })
              );
              setName("");
              setEmail("");
              setValue("");
            }}
          >
            Add Lead
          </button>
        </div>
      </div>

      <div className="grid gap-3">
        {loading && <div>Loading...</div>}
        {filtered.map((l) => (
          <Link
            key={l.id}
            to={`/leads/${l.id}`}
            className="card flex items-center justify-between hover:shadow-md transition"
          >
            <div>
              {/* ✅ FIXED TAG: removed stray </span> */}
              <div className="font-medium">{l.name}</div>
              <div className="text-sm text-muted">
                Owner: {l.owner?.name || "Unassigned"}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {l.value && (
                <div className="text-sm text-muted">
                  ₹{l.value.toLocaleString()}
                </div>
              )}
              <StatusBadge s={l.status} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
