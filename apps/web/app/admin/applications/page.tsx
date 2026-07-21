"use client";

import { useEffect, useState } from "react";
import { Check, X, Clock, AlertCircle, Eye, FileText, User } from "lucide-react";

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modal State
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/admin/applications", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to fetch applications");
      const data = await res.json();
      setApplications(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/admin/applications/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error("Failed to update status");
      
      // Refresh list
      fetchApplications();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return <div className="text-slate-400">Loading applications...</div>;
  }

  if (error) {
    return <div className="text-red-400">{error}</div>;
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Application Review</h1>
          <p className="text-slate-400 mt-1">Review and manage scholarship applications submitted by students.</p>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-900 border-b border-slate-800 text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Applicant</th>
              <th className="px-6 py-4 font-medium">Scholarship</th>
              <th className="px-6 py-4 font-medium">Applied Date</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {applications.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  No applications found.
                </td>
              </tr>
            ) : applications.map((app) => (
              <tr key={app.id} className="hover:bg-slate-800/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-200">{app.student.user.email}</div>
                  <div className="text-xs text-slate-500">ID: {app.student.id.substring(0, 8)}...</div>
                </td>
                <td className="px-6 py-4 text-slate-300">
                  {app.scholarship.name}
                </td>
                <td className="px-6 py-4 text-slate-400">
                  {new Date(app.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                    ${app.status === 'SUBMITTED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : ''}
                    ${app.status === 'ACCEPTED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                    ${app.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/20' : ''}
                    ${app.status === 'DRAFT' ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' : ''}
                  `}>
                    {app.status === 'SUBMITTED' && <Clock className="w-3.5 h-3.5" />}
                    {app.status === 'ACCEPTED' && <Check className="w-3.5 h-3.5" />}
                    {app.status === 'REJECTED' && <X className="w-3.5 h-3.5" />}
                    {app.status === 'DRAFT' && <AlertCircle className="w-3.5 h-3.5" />}
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button 
                    onClick={() => setSelectedStudent(app.student)}
                    className="px-3 py-1.5 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 rounded-md font-medium text-xs transition-colors inline-flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Profile
                  </button>

                  {app.status === "SUBMITTED" && (
                    <>
                      <button 
                        onClick={() => updateStatus(app.id, "ACCEPTED")}
                        className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-md font-medium text-xs transition-colors"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => updateStatus(app.id, "REJECTED")}
                        className="px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-md font-medium text-xs transition-colors"
                      >
                        Deny
                      </button>
                    </>
                  )}
                  {app.status !== "SUBMITTED" && (
                    <span className="text-xs text-slate-500 italic ml-2">Reviewed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Student Profile Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] shadow-2xl overflow-hidden flex flex-col">
            
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Student Profile</h2>
                  <p className="text-xs text-slate-400">{selectedStudent.user.email}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedStudent(null)} 
                className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Academic Overview */}
              <div>
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">Academic Overview</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <p className="text-xs text-slate-500 mb-1">Major</p>
                    <p className="font-medium text-slate-200">{selectedStudent.major || 'Not specified'}</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <p className="text-xs text-slate-500 mb-1">CGPA</p>
                    <p className="font-medium text-slate-200">{selectedStudent.cgpa ? `${selectedStudent.cgpa} / 4.0` : 'Not specified'}</p>
                  </div>
                </div>
              </div>

              {/* Test Scores */}
              {selectedStudent.testScores && Object.keys(selectedStudent.testScores).length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">Test Scores</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(selectedStudent.testScores).map(([test, score]) => (
                      <div key={test} className="bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700/50 flex gap-3 items-center">
                        <span className="text-slate-300 font-medium">{test}</span>
                        <span className="text-indigo-400 font-bold">{score as React.ReactNode}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills & Interests */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">Research Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(selectedStudent.researchInterests) && selectedStudent.researchInterests.length > 0 ? (
                      selectedStudent.researchInterests.map((interest: string, i: number) => (
                        <span key={i} className="px-2.5 py-1 text-xs rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {interest}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500 italic">None specified</span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(selectedStudent.skills) && selectedStudent.skills.length > 0 ? (
                      selectedStudent.skills.map((skill: string, i: number) => (
                        <span key={i} className="px-2.5 py-1 text-xs rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500 italic">None specified</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">Uploaded Documents</h3>
                {selectedStudent.documents && selectedStudent.documents.length > 0 ? (
                  <div className="space-y-2">
                    {selectedStudent.documents.map((doc: any) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-indigo-400" />
                          <div>
                            <p className="text-sm font-medium text-slate-200">{doc.type}</p>
                            <p className="text-xs text-slate-500">{new Date(doc.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <a 
                          href={doc.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="px-3 py-1.5 text-xs font-medium text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg transition-colors"
                        >
                          View File
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center">
                    <p className="text-sm text-slate-500 italic">No documents uploaded.</p>
                  </div>
                )}
              </div>
              
            </div>
            
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
              <button 
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
