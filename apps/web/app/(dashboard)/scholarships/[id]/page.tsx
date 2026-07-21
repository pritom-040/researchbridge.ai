"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ScholarshipDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [scholarship, setScholarship] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchScholarshipAndStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch scholarship
        const res = await fetch(`http://localhost:8000/api/scholarships/${params.id}`);
        const data = await res.json();
        setScholarship(data);

        // Fetch application status
        if (token) {
          setIsAuthenticated(true);
          const statusRes = await fetch(`http://localhost:8000/api/applications/status/${params.id}`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (statusRes.ok) {
            const statusData = await statusRes.json();
            setHasApplied(statusData.applied);
          }
        }
      } catch (error) {
        console.error("Failed to fetch scholarship details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) {
      fetchScholarshipAndStatus();
    }
  }, [params.id]);

  const handleApply = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setIsApplying(true);
    setApplyError("");

    try {
      const res = await fetch(`http://localhost:8000/api/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ scholarshipId: params.id })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to apply");
      }

      setHasApplied(true);
    } catch (err: any) {
      setApplyError(err.message);
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading details...</div>;
  }

  if (!scholarship) {
    return <div className="p-8 text-center text-red-500">Scholarship not found.</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      <Link href="/scholarships" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Scholarships
      </Link>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {scholarship.fundingType === "FULLY_FUNDED" ? "Fully Funded" : scholarship.fundingType}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            {scholarship.degreeLevel}
          </span>
        </div>

        <h1 className="text-3xl font-bold mb-4">{scholarship.name}</h1>

        <div className="flex flex-wrap gap-6 text-slate-600 dark:text-slate-400 mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2"><BookOpen className="w-5 h-5" /> {scholarship.university?.name}</div>
          <div className="flex items-center gap-2"><Globe className="w-5 h-5" /> {scholarship.university?.country}</div>
          <div className="flex items-center gap-2"><Clock className="w-5 h-5" /> Deadline: {scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString() : 'Varies'}</div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-3">About the Program</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
              {scholarship.description}
            </p>
          </div>

          {applyError && (
            <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm">
              {applyError}
            </div>
          )}

          <button 
            onClick={handleApply}
            disabled={hasApplied || isApplying}
            className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center min-w-[150px] ${
              hasApplied 
                ? "bg-green-100 text-green-700 cursor-default border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                : "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-70"
            }`}
          >
            {isApplying ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : hasApplied ? (
              "Applied"
            ) : !isAuthenticated ? (
              "Login to Apply"
            ) : (
              "Apply Now"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
