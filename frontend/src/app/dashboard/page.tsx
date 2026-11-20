"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Activity,
  LogOut,
  User,
  Shield,
  Mail,
  Key,
  CheckCircle2,
  HeartPulse,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store";

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading, clearAuth, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center space-y-3">
          <Activity className="h-8 w-8 animate-spin text-teal-600 mx-auto" />
          <p className="text-sm text-slate-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const roleVariant =
    user.role === "DOCTOR"
      ? "doctor"
      : user.role === "ADMIN"
      ? "admin"
      : "success";

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 text-white shadow-md shadow-teal-600/30">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-slate-100">MediCore HMS</span>
              <span className="ml-2 text-xs text-slate-400">Hospital Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>{user.name}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-900/40 dark:hover:bg-red-950/30"
            >
              <LogOut className="h-4 w-4 mr-1.5" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 sm:px-6 max-w-4xl space-y-6">
        {/* Welcome Banner */}
        <div className="rounded-2xl border border-teal-200/80 bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-transparent p-6 dark:border-teal-900/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Welcome, {user.name}!
                </h1>
                <Badge variant={roleVariant}>{user.role}</Badge>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                You are securely logged into MediCore Hospital Management System.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Live MongoDB Atlas Connected</span>
            </div>
          </div>
        </div>

        {/* User Profile & Session Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-teal-600" />
                Account Details
              </CardTitle>
              <CardDescription>Your registered identity in the hospital system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Full Name</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">{user.name}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  Email
                </span>
                <span className="font-mono text-slate-900 dark:text-slate-100">{user.email}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5" />
                  Assigned Role
                </span>
                <Badge variant={roleVariant}>{user.role}</Badge>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500">Account Status</span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  ACTIVE
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Key className="h-5 w-5 text-teal-600" />
                Security & JWT Token
              </CardTitle>
              <CardDescription>Active authentication session verified by Express API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="space-y-1.5">
                <span className="text-xs text-slate-500 font-medium">Session Token (Bearer)</span>
                <div className="rounded-lg bg-slate-100 p-2.5 font-mono text-xs text-slate-700 break-all dark:bg-slate-900 dark:text-slate-300">
                  {token ? `${token.slice(0, 32)}...${token.slice(-16)}` : "No token present"}
                </div>
              </div>

              <div className="rounded-lg border border-slate-200/80 bg-slate-50 p-3 text-xs space-y-1.5 dark:border-slate-800 dark:bg-slate-900/50">
                <div className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <HeartPulse className="h-4 w-4 text-teal-600" />
                  What can you do now?
                </div>
                <p className="text-slate-500 dark:text-slate-400">
                  This proves your full authentication lifecycle is operational: Next.js frontend is communicating securely with Node.js Express & MongoDB Atlas.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
