import { Search, Filter, Mail, Users, ExternalLink, BookmarkPlus } from "lucide-react";

export default function ProfessorsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Professor Directory</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Connect with leading academics matching your research interests.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Filters Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-4 font-semibold border-b border-slate-100 dark:border-slate-800 pb-3">
              <Filter className="w-4 h-4" /> Filters
            </div>
            
            <div className="space-y-5">
              <FilterSection title="Research Area" options={["Machine Learning", "Quantum Computing", "Bioinformatics", "Robotics"]} />
              <FilterSection title="University Rank" options={["Top 10", "Top 50", "Top 100", "Any"]} />
              <FilterSection title="Accepting Students" options={["Yes, actively hiring", "Check website"]} />
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="flex-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, university, or specific research topics..."
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <ProfessorCard 
              name="Dr. Fei-Fei Li"
              university="Stanford University"
              department="Computer Science"
              interests={["Computer Vision", "Cognitive AI", "Healthcare AI"]}
              match="99%"
              citations="200K+"
              hiring="Yes"
            />
            <ProfessorCard 
              name="Dr. Yoshua Bengio"
              university="MILA, University of Montreal"
              department="Computer Science"
              interests={["Deep Learning", "NLP", "Causal Representation"]}
              match="96%"
              citations="700K+"
              hiring="Yes"
            />
            <ProfessorCard 
              name="Dr. Geoffrey Hinton"
              university="University of Toronto"
              department="Computer Science"
              interests={["Neural Networks", "Deep Learning", "Cognitive Science"]}
              match="91%"
              citations="800K+"
              hiring="Check Website"
            />
            <ProfessorCard 
              name="Dr. Yann LeCun"
              university="New York University (NYU)"
              department="Data Science"
              interests={["Self-Supervised Learning", "Computer Vision"]}
              match="88%"
              citations="300K+"
              hiring="Yes"
            />
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

function ProfessorCard({ name, university, department, interests, match, citations, hiring }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-300 dark:hover:border-blue-800 transition-colors flex flex-col justify-between group cursor-pointer">
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xl font-bold text-slate-500">
            {name.charAt(4)}
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            {match} MATCH
          </span>
        </div>
        
        <h3 className="text-lg font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{name}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{department}</p>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">{university}</p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {interests.map((interest: string) => (
            <span key={interest} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs rounded-md">
              {interest}
            </span>
          ))}
        </div>
      </div>
      
      <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-auto">
        <div className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          <span>{citations} citations</span>
        </div>
        {hiring === "Yes" ? (
          <span className="text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Hiring
          </span>
        ) : (
          <span>{hiring}</span>
        )}
      </div>
    </div>
  );
}
