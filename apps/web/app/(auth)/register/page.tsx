"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [registerType, setRegisterType] = useState<"STUDENT" | "ADMIN">("STUDENT");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const form = new FormData(e.currentTarget);
      const name = form.get("name") as string;
      const email = form.get("email") as string;
      const password = form.get("password") as string;

      const res = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: registerType })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to register. Please check your database connection.");
      }

      // Store token (in a real app, use HTTP-only cookies or context)
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        router.push(data.role === "ADMIN" ? "/admin" : "/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Join ResearchBridge to find your perfect academic fit</p>
      </div>

      <div className="flex p-1 mb-8 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <button
          onClick={() => setRegisterType("STUDENT")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            registerType === "STUDENT" 
              ? "bg-white dark:bg-slate-700 text-blue-600 shadow-sm" 
              : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          Student
        </button>
        <button
          onClick={() => setRegisterType("ADMIN")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            registerType === "ADMIN" 
              ? "bg-white dark:bg-slate-700 text-blue-600 shadow-sm" 
              : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          Administrator
        </button>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
            <input 
              name="name"
              type="text" 
              required 
              placeholder="Pritom" 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
            <input 
              name="email"
              type="email" 
              required 
              placeholder="pritom@example.com" 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
            <input 
              name="password"
              type="password" 
              required 
              placeholder="••••••••" 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
            />
          </div>
        </div>

        <div className="pt-2">
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-70"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Create account <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </form>

      <div className="mt-8 text-center text-sm text-slate-500">
        Already have an account? <Link href="/login" className="text-blue-600 hover:underline font-medium">Sign in</Link>
      </div>
    </div>
  );
}
