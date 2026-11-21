"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  Users,
  Stethoscope,
  UserCheck,
  Building2,
  RefreshCw,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Loader2,
  ExternalLink,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store";
import { authService, doctorService } from "@/services/api";
import type { UserSession, Doctor } from "@/types";

const ALL_DAYS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading, clearAuth, initialize } = useAuthStore();
  const [allUsers, setAllUsers] = useState<UserSession[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [isDoctorsLoading, setIsDoctorsLoading] = useState(false);

  // Add Doctor Form state
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [isSubmittingDoctor, setIsSubmittingDoctor] = useState(false);
  const [docName, setDocName] = useState("");
  const [docEmail, setDocEmail] = useState("");
  const [docPhone, setDocPhone] = useState("");
  const [docDept, setDocDept] = useState("Cardiology");
  const [docSpecialization, setDocSpecialization] = useState("");
  const [docQualification, setDocQualification] = useState("MBBS, FCPS");
  const [docExperience, setDocExperience] = useState(5);
  const [docFee, setDocFee] = useState(1000);
  const [docRoom, setDocRoom] = useState("Room 301, 3rd Floor");
  const [selectedDays, setSelectedDays] = useState<string[]>(["Saturday", "Monday", "Wednesday"]);
  const [startTime, setStartTime] = useState("05:00 PM");
  const [endTime, setEndTime] = useState("09:00 PM");

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Load all users and doctors if current user is ADMIN
  useEffect(() => {
    let isSubscribed = true;
    if (user?.role === "ADMIN") {
      authService
        .getAllUsers()
        .then((res) => {
          if (isSubscribed && res.success && res.data) {
            setAllUsers(res.data.users);
          }
        })
        .catch(console.error);

      doctorService
        .getAll()
        .then((res) => {
          if (isSubscribed && res.success && res.data) {
            setDoctors(res.data.doctors);
          }
        })
        .catch(console.error);
    }
    return () => {
      isSubscribed = false;
    };
  }, [user?.role]);

  const fetchUsers = async () => {
    setIsUsersLoading(true);
    try {
      const res = await authService.getAllUsers();
      if (res.success && res.data) {
        setAllUsers(res.data.users);
      }
    } catch (err: unknown) {
      console.error("Failed to load users for admin:", err);
    } finally {
      setIsUsersLoading(false);
    }
  };

  const fetchDoctors = async () => {
    setIsDoctorsLoading(true);
    try {
      const res = await doctorService.getAll();
      if (res.success && res.data) {
        setDoctors(res.data.doctors);
      }
    } catch (err: unknown) {
      console.error("Failed to load doctors:", err);
    } finally {
      setIsDoctorsLoading(false);
    }
  };

  const handleCreateDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName || !docEmail || !docSpecialization) {
      toast.error("Please fill in required doctor details");
      return;
    }

    try {
      setIsSubmittingDoctor(true);
      const res = await doctorService.create({
        name: docName,
        email: docEmail,
        phone: docPhone || "+8801700000000",
        department: docDept,
        specialization: docSpecialization,
        qualification: docQualification,
        experienceYears: Number(docExperience),
        consultationFee: Number(docFee),
        availableDays: selectedDays,
        availableTime: { start: startTime, end: endTime },
        roomNumber: docRoom,
      });

      if (res.success) {
        toast.success(`Doctor Created Successfully!`, {
          description: `${docName} registered with portal credentials.`,
        });
        setShowAddDoctorModal(false);
        // Reset form
        setDocName("");
        setDocEmail("");
        setDocSpecialization("");
        fetchDoctors();
        fetchUsers();
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to register doctor";
      toast.error("Doctor Registration Failed", { description: message });
    } finally {
      setIsSubmittingDoctor(false);
    }
  };

  const handleDeleteDoctor = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from hospital records?`)) return;

    try {
      await doctorService.delete(id);
      toast.success("Doctor Removed Successfully");
      setDoctors((prev) => prev.filter((d) => d.id !== id));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Delete failed";
      toast.error("Failed to delete doctor", { description: message });
    }
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

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
    user.role === "DOCTOR" ? "doctor" : user.role === "ADMIN" ? "admin" : "success";

  const totalDoctors = doctors.length > 0 ? doctors.length : allUsers.filter((u) => u.role === "DOCTOR").length;
  const totalPatients = allUsers.filter((u) => u.role === "PATIENT").length;
  const totalStaff = allUsers.filter((u) => u.role === "STAFF").length;

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
        <div className="w-full max-w-[1640px] mx-auto flex h-18 items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16">
          <Link
            href="/"
            title="Back to MediCore Homepage"
            className="flex items-center gap-2.5 group cursor-pointer hover:opacity-90 transition-opacity"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md shadow-teal-600/30 group-hover:bg-teal-700 transition-colors">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                MediCore HMS
              </span>
              <span className="ml-2 text-xs text-slate-400">
                {user.role === "ADMIN" ? "Admin Control Center" : "Hospital Portal"}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/doctors"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "hidden sm:inline-flex gap-1.5 text-xs text-teal-600 dark:text-teal-400"
              )}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Doctor Directory
            </Link>
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
      <main className="w-full max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 py-8 space-y-8">
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
                {user.role === "ADMIN"
                  ? "Manage hospital physicians, clinical rosters, patient registrations, and system records."
                  : "You are securely logged into MediCore Hospital Management System."}
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Live MongoDB Atlas Connected</span>
            </div>
          </div>
        </div>

        {/* If ADMIN: Show Hospital Statistics Cards */}
        {user.role === "ADMIN" && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="border-teal-200/60 bg-white dark:bg-slate-900 shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Specialist Doctors</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {totalDoctors}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-blue-500/15 flex items-center justify-center text-blue-600">
                  <Stethoscope className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-teal-200/60 bg-white dark:bg-slate-900 shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Registered Patients</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {totalPatients}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-600">
                  <UserCheck className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-teal-200/60 bg-white dark:bg-slate-900 shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Hospital Staff</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {totalStaff}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-600">
                  <Building2 className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-teal-200/60 bg-white dark:bg-slate-900 shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium">System Users</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {allUsers.length}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-purple-500/15 flex items-center justify-center text-purple-600">
                  <Users className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* If ADMIN: Doctor Management Section */}
        {user.role === "ADMIN" && (
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-3">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-teal-600" />
                  Hospital Specialist Physicians (Doctors)
                </CardTitle>
                <CardDescription>
                  Register and manage hospital consultants, consultation fees, and visiting hours
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => setShowAddDoctorModal(true)}
                  className="bg-teal-600 hover:bg-teal-700 text-white gap-1.5 shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  Add New Doctor
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchDoctors}
                  disabled={isDoctorsLoading}
                  className="gap-1.5"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isDoctorsLoading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-lg border border-slate-100 dark:border-slate-800">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-semibold text-slate-600 uppercase dark:bg-slate-900/60 dark:text-slate-400">
                    <tr>
                      <th className="px-4 py-3">Doctor & Specialty</th>
                      <th className="px-4 py-3">Department</th>
                      <th className="px-4 py-3">Fee (BDT)</th>
                      <th className="px-4 py-3">Visiting Schedule</th>
                      <th className="px-4 py-3">Room</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {doctors.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900 dark:text-slate-100">
                            {doc.name}
                          </div>
                          <div className="text-xs text-teal-600 dark:text-teal-400">
                            {doc.specialization}
                          </div>
                          <div className="text-[11px] text-slate-400">{doc.qualification}</div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="doctor">{doc.department}</Badge>
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                          ৳{doc.consultationFee.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400">
                          <div className="font-medium text-slate-700 dark:text-slate-300">
                            {doc.availableDays.slice(0, 3).join(", ")}
                            {doc.availableDays.length > 3 && "..."}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {doc.availableTime.start} - {doc.availableTime.end}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400">
                          {doc.roomNumber}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteDoctor(doc.id, doc.name)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {doctors.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                          {isDoctorsLoading ? "Loading doctors from database..." : "No doctors registered yet."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* If ADMIN: Show Live Users Database Table */}
        {user.role === "ADMIN" && (
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-teal-600" />
                  All System Accounts
                </CardTitle>
                <CardDescription>
                  Registered users across all roles in MongoDB Atlas
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchUsers}
                disabled={isUsersLoading}
                className="gap-1.5"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isUsersLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-lg border border-slate-100 dark:border-slate-800">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-semibold text-slate-600 uppercase dark:bg-slate-900/60 dark:text-slate-400">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email Address</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Account Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {allUsers.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                        <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                          {item.name}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-600 dark:text-slate-400">
                          {item.email}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={
                              item.role === "ADMIN"
                                ? "admin"
                                : item.role === "DOCTOR"
                                ? "doctor"
                                : "success"
                            }
                          >
                            {item.role}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            {item.status || "ACTIVE"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

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
                  Doctor Management Active
                </div>
                <p className="text-slate-500 dark:text-slate-400">
                  As Administrator, you can now add specialist physicians, configure consultation fees, and schedule chamber hours directly in MongoDB Atlas.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Add New Doctor Modal Dialog */}
      {showAddDoctorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div className="w-full max-w-xl my-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 text-white">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                    Add New Specialist Doctor
                  </h3>
                  <p className="text-xs text-slate-500">
                    Registers doctor profile and creates portal credentials
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddDoctorModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDoctor} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="docName">Doctor Full Name *</Label>
                  <Input
                    id="docName"
                    placeholder="e.g. Dr. Ayesha Rahman"
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="docEmail">Email Address (Login ID) *</Label>
                  <Input
                    id="docEmail"
                    type="email"
                    placeholder="e.g. dr.ayesha@medicore.com"
                    value={docEmail}
                    onChange={(e) => setDocEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="docDept">Department *</Label>
                  <select
                    id="docDept"
                    value={docDept}
                    onChange={(e) => setDocDept(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="General Surgery">General Surgery</option>
                    <option value="Gynecology & Obstetrics">Gynecology & Obstetrics</option>
                    <option value="ENT (Ear, Nose, Throat)">ENT (Ear, Nose, Throat)</option>
                    <option value="Ophthalmology">Ophthalmology</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="docPhone">Phone Number</Label>
                  <Input
                    id="docPhone"
                    placeholder="+8801700123456"
                    value={docPhone}
                    onChange={(e) => setDocPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="docSpec">Clinical Specialization *</Label>
                <Input
                  id="docSpec"
                  placeholder="e.g. Consultant - Interventional Cardiology"
                  value={docSpecialization}
                  onChange={(e) => setDocSpecialization(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="docQual">Qualifications</Label>
                  <Input
                    id="docQual"
                    placeholder="e.g. MBBS, FCPS, MD"
                    value={docQualification}
                    onChange={(e) => setDocQualification(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="docExp">Experience (Years)</Label>
                  <Input
                    id="docExp"
                    type="number"
                    min="0"
                    value={docExperience}
                    onChange={(e) => setDocExperience(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="docFee">Consultation Fee (BDT) *</Label>
                  <Input
                    id="docFee"
                    type="number"
                    min="100"
                    value={docFee}
                    onChange={(e) => setDocFee(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              {/* Available Days */}
              <div className="space-y-2">
                <Label>Visiting Chamber Days *</Label>
                <div className="flex flex-wrap gap-2">
                  {ALL_DAYS.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                        selectedDays.includes(day)
                          ? "bg-teal-600 text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time & Room */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="05:00 PM"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="09:00 PM"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="docRoom">Chamber / Room</Label>
                  <Input
                    id="docRoom"
                    value={docRoom}
                    onChange={(e) => setDocRoom(e.target.value)}
                    placeholder="Room 304"
                  />
                </div>
              </div>

              <div className="rounded-lg bg-teal-50 p-2.5 text-xs text-teal-800 dark:bg-teal-950/30 dark:text-teal-300 border border-teal-200/50">
                💡 Doctor will automatically receive portal login with default password:{" "}
                <span className="font-mono font-bold">Doctor@123</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddDoctorModal(false)}
                  disabled={isSubmittingDoctor}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingDoctor}
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                >
                  {isSubmittingDoctor ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving to Database...
                    </>
                  ) : (
                    "Save & Register Doctor"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
