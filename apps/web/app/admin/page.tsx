"use client";

import { useEffect, useState } from "react";
import { Users, GraduationCap, School, FileText, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const [statsRes, usersRes] = await Promise.all([
          fetch("http://localhost:8000/api/admin/stats", {
            headers: { "Authorization": `Bearer ${token}` }
          }),
          fetch("http://localhost:8000/api/admin/users", {
            headers: { "Authorization": `Bearer ${token}` }
          })
        ]);

        if (statsRes.status === 403 || usersRes.status === 403) {
          setError("Access Denied: You do not have administrator privileges.");
          return;
        }

        const statsData = await statsRes.json();
        const usersData = await usersRes.json();

        setStats(statsData);
        setUsers(usersData);
      } catch (err) {
        setError("Failed to connect to the server.");
      }
    };

    fetchAdminData();
  }, [router]);

  if (error) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Access Denied</h2>
        <p className="text-slate-400 max-w-md mx-auto">{error}</p>
        <button 
          onClick={() => router.push("/dashboard")}
          className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          Return to Student Dashboard
        </button>
      </div>
    );
  }

  if (!stats) {
    return <div className="text-slate-400 p-8 text-center">Loading admin data...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Platform Overview</h1>
        <p className="text-slate-400 mt-1">Real-time statistics and user management.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats.totalUsers} icon={<Users className="w-5 h-5 text-indigo-400" />} />
        <StatCard title="Active Scholarships" value={stats.totalScholarships} icon={<GraduationCap className="w-5 h-5 text-emerald-400" />} />
        <StatCard title="Universities" value={stats.totalUniversities} icon={<School className="w-5 h-5 text-blue-400" />} />
        <StatCard title="Applications" value={stats.totalApplications} icon={<FileText className="w-5 h-5 text-purple-400" />} />
      </div>

      {/* Users Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white">Recent Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 text-sm">
                <th className="p-4 font-medium">User ID</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Joined Date</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) {
  return (
    <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-slate-900 rounded-lg">
          {icon}
        </div>
        <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
      </div>
      <p className="text-3xl font-bold text-white ml-1">{value}</p>
    </div>
  );
}
