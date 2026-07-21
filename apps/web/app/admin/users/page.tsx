"use client";

import { useEffect, useState } from "react";
import { Users, AlertTriangle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    try {
      const res = await fetch("http://localhost:8000/api/admin/users", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.status === 403) return setError("Access Denied");
      
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [router]);

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this user? This cannot be undone.")) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8000/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        setUsers(users.filter(u => u.id !== id));
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to delete user");
      }
    } catch (err) {
      alert("Network error. Failed to delete user.");
    }
  };

  if (error) {
    return <div className="text-red-400 p-8 text-center">{error}</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <Users className="w-8 h-8 text-indigo-400" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Manage Users</h1>
          <p className="text-slate-400 mt-1">View and manage all registered accounts on the platform.</p>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 text-sm">
                <th className="p-4 font-medium">User ID</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Joined Date</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-slate-500 font-mono text-xs">{user.id.substring(0, 8)}...</td>
                  <td className="p-4 font-medium text-slate-200">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded text-xs font-semibold ${
                      user.role === 'ADMIN' ? 'bg-rose-500/10 text-rose-400' :
                      user.role === 'PROFESSOR' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-indigo-500/10 text-indigo-400'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    {user.role !== 'ADMIN' && (
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
