import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center relative overflow-hidden z-0">
      {/* Background Image */}
      <div 
        className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat opacity-60 dark:opacity-30 mix-blend-multiply dark:mix-blend-screen"
        style={{ backgroundImage: "url('/bg-pattern.png')" }}
      />
      
      {/* Gradient Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/80 to-background -z-10" />
      
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-sm font-medium mb-8">
        <Sparkles className="w-4 h-4" />
        <span>Welcome to the future of academic research</span>
      </div>
      
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
        Discover Your Next <br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700">
          Research Opportunity
        </span>
      </h1>
      
      <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mb-10">
        AI-powered matching for scholarships, professors, and university programs. 
        Tailored precisely to your academic profile and career goals.
      </p>
      
      <div className="flex gap-4">
        <Link href="/register" className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-2 transition-colors">
          Get Started <ArrowRight className="w-4 h-4" />
        </Link>
        <Link href="/scholarships" className="px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-foreground font-medium transition-colors">
          Browse Scholarships
        </Link>
      </div>
    </div>
  );
}
