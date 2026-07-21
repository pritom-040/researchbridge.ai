"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // Check if the current route is public
    // We allow unauthenticated users to view the scholarships page
    const isPublicRoute = pathname === "/scholarships" || pathname?.startsWith("/scholarships/");

    if (!token && !isPublicRoute) {
      router.push("/login");
    } else {
      setIsAuthorized(true);
    }
  }, [pathname, router]);

  // Don't render children until we've verified authorization to prevent UI flickering
  if (!isAuthorized) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    </div>;
  }

  return <>{children}</>;
}
