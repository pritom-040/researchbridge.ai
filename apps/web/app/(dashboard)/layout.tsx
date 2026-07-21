import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { AuthGuard } from "../components/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
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
