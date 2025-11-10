import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store";
import toast from "react-hot-toast";

export default function ProtectedRoute({ element, allowed }: { element: JSX.Element; allowed: Array<'ADMIN'|'MANAGER'|'SALES'> }) {
  const { user } = useAppSelector(s => s.auth);
  if (!user) return <Navigate to="/login" replace />;
  if (!allowed.includes(user.role)) {
    toast.error("Access denied for your role");
    return <Navigate to="/" replace />;
  }
  return element;
}
