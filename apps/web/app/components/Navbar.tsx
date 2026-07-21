import Link from "next/link";
import { Search, Bell, User, Menu } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center px-4 md:px-6 w-full">
        <div className="flex items-center gap-4">
          <button className="md:hidden p-2 -ml-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              R
            </div>
            <span className="font-bold text-xl hidden sm:inline-block tracking-tight">
              ResearchBridge<span className="text-blue-600">.AI</span>
            </span>
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <div className="hidden md:flex relative w-64 lg:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="search"
              placeholder="Search scholarships, professors..."
              className="h-9 w-full rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 pl-9 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
          
          <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          </button>
          <Link href="/settings" className="p-1 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
              <User className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
