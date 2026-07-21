import { Bookmark, GraduationCap, Users, School } from "lucide-react";

export default function SavedItemsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Saved Items</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your bookmarked scholarships, professors, and universities.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button className="px-4 py-3 text-sm font-medium border-b-2 border-blue-600 text-blue-600 flex items-center gap-2">
          <GraduationCap className="w-4 h-4" /> Scholarships (12)
        </button>
        <button className="px-4 py-3 text-sm font-medium border-b-2 border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-2">
          <Users className="w-4 h-4" /> Professors (5)
        </button>
        <button className="px-4 py-3 text-sm font-medium border-b-2 border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-2">
          <School className="w-4 h-4" /> Universities (3)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4">
        <SavedCard 
          title="Knight-Hennessy Scholars"
          subtitle="Stanford University • United States"
          type="Scholarship"
          match="98%"
          savedOn="Oct 01, 2026"
        />
        <SavedCard 
          title="DAAD Master's Scholarship"
          subtitle="German Academic Exchange Service • Germany"
          type="Scholarship"
          match="95%"
          savedOn="Sep 28, 2026"
        />
        <SavedCard 
          title="Erasmus Mundus Joint Master Degrees"
          subtitle="Multiple Universities • Europe"
          type="Scholarship"
          match="94%"
          savedOn="Sep 15, 2026"
        />
      </div>
    </div>
  );
}

function SavedCard({ title, subtitle, type, match, savedOn }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between group">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            {match} MATCH
          </span>
          <span className="text-xs text-slate-500">Saved on {savedOn}</span>
        </div>
        <h3 className="text-lg font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
      </div>
      <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-full transition-colors" title="Remove bookmark">
        <Bookmark className="w-5 h-5 fill-current" />
      </button>
    </div>
  );
}
