"use client";

import { useEffect, useState } from "react";
import { GraduationCap, Trash2, Edit, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminScholarships() {
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [universities, setUniversities] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    fundingType: "FULLY_FUNDED",
    degreeLevel: "PHD",
    deadline: "",
    universityId: ""
  });

  const fetchScholarships = async () => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");
    try {
      const res = await fetch("http://localhost:8000/api/admin/scholarships", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.status === 403) return setError("Access Denied");
      const data = await res.json();
      setScholarships(data);
    } catch (err) {
      setError("Failed to fetch scholarships");
    }
  };

  const fetchUniversities = async () => {
    const token = localStorage.getItem("token");
    try {
      // NOTE: Using a public or admin route for universities. Assuming /api/universities is available from web/page.tsx or we use the admin stats if they export it.
      // Actually we have /api/admin/universities ! Wait, no, we might not. Let's just fetch from the public route or admin route.
      // Based on adminRoutes.ts, we have `router.get("/universities", getAllUniversities)` but wait, is it there?
      // Yes, in a previous turn we saw it. Or I'll just use a direct query. Let's assume `/api/admin/universities` works or `/api/universities`.
      // Let's use `http://localhost:8000/api/universities` because it's public.
      const res = await fetch("http://localhost:8000/api/universities");
      const json = await res.json();
      setUniversities(json.data || []);
    } catch (err) {
      console.error("Failed to fetch universities", err);
    }
  };

  useEffect(() => {
    fetchScholarships();
    fetchUniversities();
  }, [router]);

  const openModalForCreate = () => {
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      fundingType: "FULLY_FUNDED",
      degreeLevel: "PHD",
      deadline: "",
      universityId: universities.length > 0 ? universities[0].id : ""
    });
    setIsModalOpen(true);
  };

  const openModalForEdit = (scholarship: any) => {
    setEditingId(scholarship.id);
    setFormData({
      name: scholarship.name,
      description: scholarship.description,
      fundingType: scholarship.fundingType,
      degreeLevel: scholarship.degreeLevel,
      deadline: scholarship.deadline ? new Date(scholarship.deadline).toISOString().split('T')[0] : "",
      universityId: scholarship.universityId
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const url = editingId 
        ? `http://localhost:8000/api/admin/scholarships/${editingId}`
        : `http://localhost:8000/api/admin/scholarships`;
      
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Failed to save scholarship");
      
      setIsModalOpen(false);
      fetchScholarships();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteScholarship = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this scholarship?")) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8000/api/admin/scholarships/${id}`, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        setScholarships(scholarships.filter(s => s.id !== id));
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to delete scholarship");
      }
    } catch (err) {
      alert("Network error. Failed to delete scholarship.");
    }
  };

  if (error) {
    return <div className="text-red-400 p-8 text-center">{error}</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-emerald-400" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Manage Scholarships</h1>
            <p className="text-slate-400 mt-1">View and manage all active scholarships on the platform.</p>
          </div>
        </div>
        <button 
          onClick={openModalForCreate}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Scholarship
        </button>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 text-sm">
                <th className="p-4 font-medium">Scholarship Name</th>
                <th className="p-4 font-medium">University</th>
                <th className="p-4 font-medium">Funding Type</th>
                <th className="p-4 font-medium">Deadline</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {scholarships.map((scholarship) => (
                <tr key={scholarship.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-medium text-slate-200">{scholarship.name}</td>
                  <td className="p-4 text-slate-400">{scholarship.university?.name || "Unknown"}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400">
                      {scholarship.fundingType}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">{scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString() : "No Deadline"}</td>
                  <td className="p-4 text-right space-x-2">
                    <button 
                      onClick={() => openModalForEdit(scholarship)}
                      className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 p-2 rounded-lg transition-colors"
                      title="Edit Scholarship"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteScholarship(scholarship.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                      title="Delete Scholarship"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {scholarships.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">No scholarships found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-xl font-semibold">{editingId ? 'Edit Scholarship' : 'Add New Scholarship'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-800 rounded-md text-slate-400 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Description</label>
                <textarea 
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Funding Type</label>
                  <select 
                    value={formData.fundingType}
                    onChange={(e) => setFormData({...formData, fundingType: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors text-white"
                  >
                    <option value="FULLY_FUNDED">Fully Funded</option>
                    <option value="PARTIAL">Partial</option>
                    <option value="SELF_FUNDED">Self Funded</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Degree Level</label>
                  <select 
                    value={formData.degreeLevel}
                    onChange={(e) => setFormData({...formData, degreeLevel: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors text-white"
                  >
                    <option value="BS">Bachelor's</option>
                    <option value="MS">Master's</option>
                    <option value="PHD">PhD</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Deadline</label>
                  <input 
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">University</label>
                  <select 
                    required
                    value={formData.universityId}
                    onChange={(e) => setFormData({...formData, universityId: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors text-white"
                  >
                    <option value="">Select University...</option>
                    {universities.map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                >
                  {editingId ? 'Save Changes' : 'Create Scholarship'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
