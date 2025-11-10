import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchUsers } from "../store/slices/users";
import { Link } from "react-router-dom";

export default function Users() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((s) => s.users);
  const { user } = useAppSelector((s) => s.auth);

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <h1 className="title">Users</h1>
        {/* Show Add User button only for Admins */}
        {isAdmin && (
          <Link
            to="/users/new"
            className="btn btn-primary flex items-center gap-2"
          >
            + Add User
          </Link>
        )}
      </div>

      {/* User list */}
      <div className="grid gap-3">
        {loading && <div>Loading...</div>}
        {items.map((u) => (
          <div key={u.id} className="card flex items-center justify-between">
            <div>
              <div className="font-medium">{u.name}</div>
              <div className="text-sm text-muted">{u.email}</div>
            </div>
            <div className="badge">{u.role}</div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {!loading && items.length === 0 && (
        <div className="text-center text-muted text-sm">
          No users found. {isAdmin && "Click 'Add User' to create one."}
        </div>
      )}
    </div>
  );
}
