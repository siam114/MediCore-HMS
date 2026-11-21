import Link from "next/link";
import { Activity, ArrowRight, ShieldCheck, Database, Server, Laptop } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-teal-50/20 to-sky-50/30 p-6 text-center dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="w-full max-w-xl space-y-8">
        {/* Brand Icon */}
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-xl shadow-teal-600/30">
          <Activity className="h-8 w-8" />
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">
            MediCore – Hospital Management System
          </h1>
          <p className="text-base text-slate-600 max-w-md mx-auto dark:text-slate-400">
            Full-stack Hospital Portal with Next.js 16, TypeScript, Express.js REST API, and Live MongoDB Atlas Database.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/login"
            className={cn(
              buttonVariants({ size: "lg" }),
              "w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/25"
            )}
          >
            Sign In to Portal
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>

          <Link
            href="/doctors"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "w-full sm:w-auto border-teal-600/30 text-teal-700 hover:bg-teal-50 dark:text-teal-400 dark:border-teal-700"
            )}
          >
            Find Specialist Doctors
          </Link>

          <Link
            href="/register"
            className={cn(
              buttonVariants({ variant: "ghost", size: "lg" }),
              "w-full sm:w-auto text-slate-600 dark:text-slate-400"
            )}
          >
            Patient Registration
          </Link>
        </div>

        {/* System Architecture Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs">
          <div className="flex items-center justify-center gap-2 rounded-lg border border-slate-200/80 bg-white/70 p-3 text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
            <Laptop className="h-4 w-4 text-teal-600" />
            <span>Next.js 16 (App Router)</span>
          </div>

          <div className="flex items-center justify-center gap-2 rounded-lg border border-slate-200/80 bg-white/70 p-3 text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
            <Server className="h-4 w-4 text-emerald-600" />
            <span>Express.js REST API</span>
          </div>

          <div className="flex items-center justify-center gap-2 rounded-lg border border-slate-200/80 bg-white/70 p-3 text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
            <Database className="h-4 w-4 text-green-600" />
            <span>MongoDB Atlas Live</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="h-4 w-4 text-teal-600" />
          <span>Role-Based Access Control (Admin, Doctor, Staff, Patient)</span>
        </div>
      </div>
    </main>
  );
}
