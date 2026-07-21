"use client";

import { Plus, MoreHorizontal, Calendar, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMyApplications = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const res = await fetch("http://localhost:8000/api/applications/my-applications", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setApplications(data);
        }
      } catch (err) {
        console.error("Failed to fetch applications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyApplications();
  }, [router]);

  if (loading) {
    return <div className="p-8 text-slate-500 animate-pulse">Loading applications...</div>;
  }

  const drafts = applications.filter(a => a.status === "DRAFT");
  const submitted = applications.filter(a => a.status === "SUBMITTED");
  const underReview = applications.filter(a => a.status === "UNDER_REVIEW");
  const interview = applications.filter(a => a.status === "INTERVIEW");
  const accepted = applications.filter(a => a.status === "ACCEPTED");
  const rejected = applications.filter(a => a.status === "REJECTED");

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Track and manage all your scholarship and program applications.</p>
        </div>
        <button 
          onClick={() => router.push("/scholarships")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Find Scholarships
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-max h-full">
          
          <KanbanColumn title="Draft" count={drafts.length} color="bg-slate-200 dark:bg-slate-700">
            {drafts.map(app => (
              <ApplicationCard 
                key={app.id}
                title={app.scholarship.name}
                university={app.scholarship.university?.name || "Unknown University"}
                deadline={app.scholarship.deadline ? new Date(app.scholarship.deadline).toLocaleDateString() : undefined}
                progress={50} // Mock progress for draft
              />
            ))}
          </KanbanColumn>
          
          <KanbanColumn title="Submitted" count={submitted.length} color="bg-blue-200 dark:bg-blue-900">
            {submitted.map(app => (
              <ApplicationCard 
                key={app.id}
                title={app.scholarship.name}
                university={app.scholarship.university?.name || "Unknown University"}
                submittedOn={app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : undefined}
                progress={100}
              />
            ))}
          </KanbanColumn>

          <KanbanColumn title="Under Review" count={underReview.length} color="bg-amber-200 dark:bg-amber-900">
            {underReview.map(app => (
               <ApplicationCard 
                key={app.id}
                title={app.scholarship.name}
                university={app.scholarship.university?.name || "Unknown University"}
                submittedOn={app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : undefined}
                progress={100}
              />
            ))}
          </KanbanColumn>

          <KanbanColumn title="Interview" count={interview.length} color="bg-purple-200 dark:bg-purple-900">
            {interview.map(app => (
               <ApplicationCard 
                key={app.id}
                title={app.scholarship.name}
                university={app.scholarship.university?.name || "Unknown University"}
                interviewDate="Pending schedule" // Replace if you add interview dates to schema
                progress={100}
              />
            ))}
          </KanbanColumn>

          <KanbanColumn title="Accepted" count={accepted.length} color="bg-green-200 dark:bg-green-900">
            {accepted.map(app => (
               <ApplicationCard 
                key={app.id}
                title={app.scholarship.name}
                university={app.scholarship.university?.name || "Unknown University"}
                progress={100}
              />
            ))}
          </KanbanColumn>

          <KanbanColumn title="Rejected" count={rejected.length} color="bg-red-200 dark:bg-red-900">
            {rejected.map(app => (
               <ApplicationCard 
                key={app.id}
                title={app.scholarship.name}
                university={app.scholarship.university?.name || "Unknown University"}
                progress={100}
              />
            ))}
          </KanbanColumn>
          
        </div>
      </div>
    </div>
  );
}

function KanbanColumn({ title, count, color, children }: any) {
  return (
    <div className="w-80 flex flex-col h-full bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${color}`} />
          <h3 className="font-semibold text-sm">{title}</h3>
          <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400">
            {count}
          </span>
        </div>
        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
        {children}
      </div>
    </div>
  );
}

function ApplicationCard({ title, university, deadline, submittedOn, interviewDate, progress }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm cursor-grab hover:border-blue-300 dark:hover:border-blue-800 transition-colors">
      <h4 className="font-semibold text-sm mb-1">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{university}</p>
      
      {progress < 100 && (
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mb-3">
          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      )}
      
      <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
        {deadline && (
          <div className="flex items-center gap-1 text-amber-600 dark:text-amber-500">
            <Calendar className="w-3.5 h-3.5" /> Due {deadline}
          </div>
        )}
        {submittedOn && (
          <div className="flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" /> Sent {submittedOn}
          </div>
        )}
        {interviewDate && (
          <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-medium">
            <Calendar className="w-3.5 h-3.5" /> {interviewDate}
          </div>
        )}
      </div>
    </div>
  );
}
