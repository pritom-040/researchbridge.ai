"use client";

import { Building2, Search, SlidersHorizontal, Globe, Trophy, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/api/universities?limit=50", {
          headers: token ? { "Authorization": `Bearer ${token}` } : {}
        });
        const json = await res.json();
        if (json.data) {
          setUniversities(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch universities", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUniversities();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative z-0">
      {/* Background Image Header */}
      <div 
        className="absolute -inset-x-8 -top-8 h-[400px] -z-20 bg-cover bg-center bg-no-repeat opacity-40 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen pointer-events-none"
        style={{ 
          backgroundImage: "url('/dashboard_bg.png')", 
          WebkitMaskImage: "linear-gradient(to bottom, black 10%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 10%, transparent 100%)"
        }}
      />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Global Universities</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Explore top-tier institutions worldwide for your research.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
            <SlidersHorizontal className="w-4 h-4" />
            Sort
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by university name or country..."
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-full text-center py-10 text-slate-500">Loading universities...</div>
            ) : universities.length === 0 ? (
              <div className="col-span-full text-center py-10 text-slate-500">No universities found.</div>
            ) : (
              universities.map((uni) => (
                <Link 
                  key={uni.id} 
                  href={`/universities/${uni.id}`}
                  className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all group flex flex-col h-full"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-md flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      #{uni.globalRank || 'N/A'}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-lg leading-tight mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {uni.name}
                  </h3>
                  
                  <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 mb-6">
                    <Globe className="w-4 h-4" />
                    {uni.country}
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 text-xs">Acceptance Rate</p>
                      <p className="font-semibold text-slate-700 dark:text-slate-200">
                        {uni.acceptanceRate ? `${(uni.acceptanceRate * 100).toFixed(0)}%` : 'Unknown'}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 text-xs">Programs</p>
                      <p className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        Explore &rarr;
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
