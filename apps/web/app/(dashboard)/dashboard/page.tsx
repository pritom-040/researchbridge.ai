"use client";

import { CheckCircle2, Circle, Clock, ChevronRight, FileText, Send, User } from "lucide-react";
import { AnalyticsChart } from "./components/AnalyticsChart";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const res = await fetch("http://localhost:8000/api/profile/dashboard", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative z-0">
      {/* Background Image Header */}
      <div
        className="absolute -inset-x-8 -top-8 h-[400px] -z-20 bg-cover bg-center bg-no-repeat opacity-40 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen pointer-events-none"
        style={{
          backgroundImage: "url('/dashboard_bg.png')",
          WebkitMaskImage: "linear-gradient(to bottom, black 20%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 20%, transparent 100%)"
        }}
      />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, Pritom!</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Here is what is happening with your applications today.</p>
        </div>
        <Link href="/scholarships" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors hidden sm:block">
          Explore Scholarships
        </Link>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Active Applications" value={stats?.activeApplications || 0} subtitle={stats?.activeApplications > 0 ? "Track your progress" : "Start applying today"} />
        <MetricCard title="Saved Scholarships" value={stats?.savedScholarships || 0} subtitle={stats?.savedScholarships > 0 ? "Review your list" : "Bookmark favorites"} />
        <Link href="/settings" className="block transition-transform hover:scale-105 active:scale-95">
          <MetricCard title="Profile Completion" value={`${stats?.profileCompletion || 20}%`} subtitle="Update your profile" isProgress progressValue={stats?.profileCompletion || 20} />
        </Link>
        <MetricCard title="AI Matches" value={stats?.aiMatches || 0} subtitle="New matches today" isHighlight />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Application Timeline and Analytics - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">Activity Overview</h2>
            <AnalyticsChart />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Application Timeline</h2>
              <Link href="/applications" className="text-sm font-medium text-blue-600 hover:underline">View All</Link>
            </div>

            <div className="relative border-l border-slate-200 dark:border-slate-800 ml-3 space-y-8 pb-4">
              {stats?.timeline && stats.timeline.length > 0 ? (
                stats.timeline.map((app: any, idx: number) => (
                  <TimelineItem
                    key={app.id}
                    status={app.status.replace("_", " ")}
                    title={app.scholarship?.name || "Application"}
                    date={`Last updated: ${new Date(app.updatedAt).toLocaleDateString()}`}
                    icon={<FileText className="w-4 h-4 text-white" />}
                    color={idx === 0 ? "bg-purple-500" : "bg-blue-500"}
                    active={idx === 0}
                  />
                ))
              ) : (
                <div className="pl-4 py-2 text-sm text-slate-500 dark:text-slate-400">
                  You have no active applications yet. <Link href="/scholarships" className="text-blue-600 hover:underline">Find a scholarship to apply for.</Link>
                </div>
              )}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Recommended for You</h2>
            </div>
            <div className="space-y-3">
              {stats?.aiMatches > 0 ? (
                <>
                  <RecommendationCard
                    title="DAAD Master's Scholarship"
                    match="95%"
                    reason="Strong match with your CGPA and IELTS score."
                  />
                </>
              ) : (
                <div className="text-sm text-slate-500 dark:text-slate-400 text-center py-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                  <p>Complete your profile to get personalized AI matches!</p>
                  <Link href="/settings" className="text-blue-600 hover:underline mt-2 inline-block font-medium">Update Profile</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Progress - Right Column */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4">Profile Checklist</h2>
            <div className="space-y-4">
              <ChecklistItem label="Account Created" completed={stats?.checklist?.accountCreated || false} />
              <ChecklistItem label="Add CGPA" completed={stats?.checklist?.hasCgpa || false} />
              <ChecklistItem label="Add Major" completed={stats?.checklist?.hasMajor || false} />
              <ChecklistItem label="Add Skills" completed={stats?.checklist?.hasSkills || false} />
              <ChecklistItem label="Add Test Scores" completed={stats?.checklist?.hasTestScores || false} />
            </div>
            <Link href="/settings" className="w-full mt-6 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors text-center inline-block">
              Complete Profile
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

// Subcomponents

function MetricCard({ title, value, subtitle, isProgress = false, progressValue = 85, isHighlight = false }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <h3 className="text-sm font-medium text-slate-500">{title}</h3>
      <div className="mt-2 flex items-baseline gap-2">
        <p className={`text-3xl font-bold ${isHighlight ? 'text-green-600 dark:text-green-500' : ''}`}>{value}</p>
      </div>
      {isProgress ? (
        <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
          <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${progressValue}%` }}></div>
        </div>
      ) : null}
      <p className="text-xs text-slate-500 mt-2">{subtitle}</p>
    </div>
  );
}

function TimelineItem({ status, title, date, icon, color, active = false }: any) {
  return (
    <div className="relative pl-8">
      <span className={`absolute -left-3.5 top-1 flex h-7 w-7 items-center justify-center rounded-full ${color} ring-4 ring-white dark:ring-slate-950`}>
        {icon}
      </span>
      <div className={`p-4 rounded-lg border ${active ? 'border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-900/10' : 'border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/30'}`}>
        <div className="flex items-center justify-between mb-1">
          <span className={`text-xs font-semibold uppercase tracking-wider ${active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}>
            {status}
          </span>
          <span className="text-xs text-slate-500">{date}</span>
        </div>
        <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
      </div>
    </div>
  );
}

function RecommendationCard({ title, match, reason }: any) {
  return (
    <div className="group p-4 rounded-lg bg-slate-50 hover:bg-blue-50 dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 transition-colors cursor-pointer flex items-start gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            {match} MATCH
          </span>
        </div>
        <h4 className="font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{title}</h4>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{reason}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 self-center" />
    </div>
  );
}

function ChecklistItem({ label, completed }: { label: string, completed: boolean }) {
  return (
    <div className="flex items-center gap-3">
      {completed ? (
        <CheckCircle2 className="w-5 h-5 text-blue-600" />
      ) : (
        <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
      )}
      <span className={`text-sm ${completed ? 'text-slate-700 dark:text-slate-300 line-through opacity-70' : 'text-slate-900 dark:text-white font-medium'}`}>
        {label}
      </span>
    </div>
  );
}
