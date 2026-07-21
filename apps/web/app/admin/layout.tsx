"use client";

import { Navbar } from "../components/Navbar";
import { ShieldCheck, LayoutDashboard, Users, GraduationCap, Settings, FileText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthGuard } from "../components/AuthGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Dark Admin Sidebar */}
        <aside className="w-64 flex-col border-r border-slate-800 bg-slate-950 h-[calc(100vh-4rem)] sticky top-16 hidden md:flex">
          <div className="p-4 border-b border-slate-800 flex items-center gap-2 text-indigo-400 font-bold">
            <ShieldCheck className="w-5 h-5" /> Admin Control
          </div>
          <nav className="flex-1 p-3 space-y-1">
            <Link 
              href="/admin" 
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${pathname === '/admin' ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'}`}
            >
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </Link>
            <Link 
              href="/admin/users" 
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${pathname === '/admin/users' ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'}`}
            >
              <Users className="w-5 h-5" /> Manage Users
            </Link>
            <Link 
              href="/admin/scholarships" 
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${pathname === '/admin/scholarships' ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'}`}
            >
              <GraduationCap className="w-5 h-5" /> Scholarships
            </Link>
            <Link 
              href="/admin/applications" 
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${pathname === '/admin/applications' ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'}`}
            >
              <FileText className="w-5 h-5" /> Applications
            </Link>
            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors mt-auto">
              <Settings className="w-5 h-5" /> Back to App
            </Link>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-7xl">
            <AuthGuard>
              {children}
            </AuthGuard>
          </div>
        </main>
      </div>
    </div>
  );
}
