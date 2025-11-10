import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store";
import { logout } from "../store/slices/auth";
import { Users, Home, LineChart, LogOut, List } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Shell() {
  const { user } = useAppSelector(s=>s.auth);
  const dispatch = useAppDispatch();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" replace />;

  const NavItem = ({to, icon:Icon, label}:{to:string; icon:any; label:string})=>(
    <Link to={to} className={`flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 ${loc.pathname===to?"bg-gray-100 dark:bg-neutral-800":""}`}>
      <Icon size={18} /> <span>{label}</span>
    </Link>
  );
  const canManage = user.role === "ADMIN" || user.role === "MANAGER";

  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr] bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-gray-100">
      <aside className="border-r border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-2xl bg-brand-600 text-white grid place-items-center font-bold">N</div>
          <div>
            <div className="font-semibold">Next-Gen CRM</div>
            <div className="text-xs text-muted">Welcome, {user?.name}</div>
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          <NavItem to="/" icon={Home} label="Dashboard" />
          <NavItem to="/leads" icon={List} label="Leads" />
          {canManage && <NavItem to="/users" icon={Users} label="Users" />}
          {canManage && <NavItem to="/analytics" icon={LineChart} label="Analytics" />}
        </nav>
        <div className="mt-8 text-xs text-muted">Role: {user?.role}</div>
        <div className="mt-4 flex items-center gap-2">
          <ThemeToggle />
          <button className="btn btn-ghost w-full" onClick={()=>dispatch(logout())}>
            <LogOut className="mr-2" size={16}/> Logout
          </button>
        </div>
      </aside>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  )
}
