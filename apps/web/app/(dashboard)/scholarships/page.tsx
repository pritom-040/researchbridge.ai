"use client";

import { Search, Filter, SlidersHorizontal, BookOpen, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const filteredScholarships = scholarships.filter(scholarship => {
    const query = searchQuery.toLowerCase();
    return (
      scholarship.name.toLowerCase().includes(query) ||
      scholarship.university?.name.toLowerCase().includes(query) ||
      scholarship.description.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
        const res = await fetch("http://localhost:8000/api/scholarships?limit=50", {
          headers: token ? { "Authorization": `Bearer ${token}` } : {}
        });
        const json = await res.json();
        if (json.data) {
          setScholarships(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch scholarships", err);
      } finally {
        setLoading(false);
      }
    };
    fetchScholarships();
  }, []);
  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative z-0">
      {/* Background Image Header */}
      <div 
        className="absolute -inset-x-8 -top-8 h-[400px] -z-20 bg-cover bg-center bg-no-repeat opacity-40 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen pointer-events-none"
        style={{ 
          backgroundImage: "url('/scholarships_bg.png')", 
          WebkitMaskImage: "linear-gradient(to bottom, black 10%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 10%, transparent 100%)"
        }}
      />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Discover Scholarships</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Find and apply to top-funded programs worldwide.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
            Sort
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Filters Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
          {isAuthenticated && (
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 p-4 rounded-xl border border-blue-200/50 dark:border-blue-800/50 shadow-sm relative overflow-hidden group cursor-pointer">
              <Link href="/settings" className="absolute inset-0 z-10" />
              <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none" />
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold mb-2">
                <Sparkles className="w-4 h-4" /> AI Insights Active
              </div>
              <p className="text-sm text-blue-900/80 dark:text-blue-200/80 leading-relaxed mb-3">
                Matches are personalized based on your profile.
              </p>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">Update Profile &rarr;</span>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-4 font-semibold border-b border-slate-100 dark:border-slate-800 pb-3">
              <Filter className="w-4 h-4" /> Filters
            </div>
            
            <div className="space-y-5">
              <FilterSection title="Degree Level" options={["Bachelor's", "Master's", "PhD", "Postdoc"]} />
              <FilterSection title="Funding Type" options={["Fully Funded", "Partial", "Tuition Waiver"]} />
              <FilterSection title="Location" options={["United States", "United Kingdom", "Germany", "Canada", "Australia"]} />
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="flex-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords, research area, or university..."
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-sm"
            />
          </div>

          <div className="space-y-4 mt-6">
            {loading ? (
              <div className="text-center py-10 text-slate-500">Loading scholarships...</div>
            ) : filteredScholarships.length === 0 ? (
              <div className="text-center py-10 text-slate-500">No scholarships found.</div>
            ) : (
              filteredScholarships.map((scholarship) => (
                <div key={scholarship.id} className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{scholarship.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {scholarship.university?.name} • {scholarship.university?.country}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-md">
                      {scholarship.fundingType === "FULLY_FUNDED" ? "Fully Funded" : scholarship.fundingType}
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
                    {scholarship.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4" />
                        <span>{scholarship.degreeLevel}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium">Deadline:</span>
                        <span>{scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString() : 'Varies'}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {isAuthenticated && scholarship.matchScore && (
                        <span className={`hidden sm:flex items-center gap-1 text-xs font-medium px-2 py-1 rounded ${
                          scholarship.isHighMatch 
                            ? "text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-900/30" 
                            : scholarship.matchScore >= 70 
                              ? "text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30"
                              : "text-orange-700 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/30"
                        }`}>
                          <Sparkles className="w-3 h-3" />
                          {scholarship.matchScore}% Match
                        </span>
                      )}
                      <Link href={`/scholarships/${scholarship.id}`} className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterSection({ title, options }: { title: string, options: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-slate-900 dark:text-slate-200 mb-3">{title}</h3>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800" />
            <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
              {option}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
