"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Building2, Globe, Trophy, Users, GraduationCap } from "lucide-react";
import Link from "next/link";

export default function UniversityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [university, setUniversity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/universities/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setUniversity(data);
        } else {
          router.push('/universities');
        }
      } catch (err) {
        console.error("Failed to fetch university details:", err);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) {
      fetchUniversity();
    }
  }, [params.id, router]);

  if (loading) {
    return <div className="p-8 text-center text-slate-500 animate-pulse">Loading university details...</div>;
  }

  if (!university) {
    return <div className="p-8 text-center text-slate-500">University not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <Link href="/universities" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Universities
      </Link>
      
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
        
        <div className="flex items-start gap-6 relative z-10">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400">
            <Building2 className="w-12 h-12" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{university.name}</h1>
              {university.globalRank && (
                <span className="px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-sm font-semibold rounded-full flex items-center gap-1.5">
                  <Trophy className="w-4 h-4" /> #{university.globalRank}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <Globe className="w-4 h-4" /> {university.country}
              </div>
              {university.acceptanceRate && (
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" /> {(university.acceptanceRate * 100).toFixed(0)}% Acceptance
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-blue-500" />
          Available Scholarships
        </h2>
        {university.scholarships && university.scholarships.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {university.scholarships.map((scholarship: any) => (
              <Link
                key={scholarship.id}
                href={`/scholarships/${scholarship.id}`}
                className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-md block group"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{scholarship.name}</h3>
                </div>
                <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">{scholarship.degreeLevel}</span>
                  <span className="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded">
                    {scholarship.fundingType === "FULLY_FUNDED" ? "Fully Funded" : scholarship.fundingType}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 border-dashed text-center text-slate-500">
            No active scholarships listed for this university.
          </div>
        )}
      </div>
    </div>
  );
}
