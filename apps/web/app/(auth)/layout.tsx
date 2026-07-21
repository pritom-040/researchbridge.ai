import { ReactNode } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden bg-background">
      {/* Background elements */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat opacity-40 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen pointer-events-none"
        style={{ backgroundImage: "url('/bg-pattern.png')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background -z-10 pointer-events-none" />

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8 z-10 transition-transform hover:scale-105">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <span className="text-2xl font-bold tracking-tight">ResearchBridge</span>
      </Link>

      {/* Content */}
      <div className="w-full max-w-md z-10">
        {children}
      </div>
    </div>
  );
}
