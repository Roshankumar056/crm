import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import LeadDetail from "./pages/LeadDetail";
import Users from "./pages/Users";
import Analytics from "./pages/Analytics";
import { useAppSelector } from "./store";
import Shell from "./components/Shell";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterUser from "./pages/RegisterUser"
export default function App() {
  const auth = useAppSelector(s => s.auth);
  const isAuthed = !!auth.token;
  return (
    <Routes>
      <Route
        path="/users/new"
        element={<ProtectedRoute element={<RegisterUser />} allowed={["ADMIN"]} />}/>
      <Route path="/login" element={<Login />} />
      <Route element={isAuthed ? <Shell /> : <Navigate to="/login" replace />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/leads" element={<ProtectedRoute element={<Leads />} allowed={["ADMIN", "MANAGER", "SALES"]} />} />
        <Route path="/leads/:id" element={<ProtectedRoute element={<LeadDetail />} allowed={["ADMIN", "MANAGER", "SALES"]} />} />
        <Route path="/users" element={<ProtectedRoute element={<Users />} allowed={["ADMIN", "MANAGER"]} />} />
        <Route path="/analytics" element={<ProtectedRoute element={<Analytics />} allowed={["ADMIN", "MANAGER"]} />} />
      </Route>
      <Route path="*" element={<Navigate to={isAuthed ? "/" : "/login"} replace />} />
    </Routes>
  )
}
