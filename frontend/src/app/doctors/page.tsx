"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Activity,
  Search,
  Stethoscope,
  Calendar,
  Clock,
  MapPin,
  Award,
  ArrowRight,
  Filter,
  Phone,
  ShieldCheck,
  Ambulance,
  HeartPulse,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { doctorService } from "@/services/api";
import { BookAppointmentDialog } from "@/components/appointments/BookAppointmentDialog";
import type { Doctor } from "@/types";

const DEPARTMENTS = [
  "All",
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "Dermatology",
  "General Medicine",
  "General Surgery",
  "Gynecology & Obstetrics",
  "Nephrology",
  "Oncology",
  "Gastroenterology",
  "Urology",
  "Ophthalmology",
  "ENT (Ear, Nose, Throat)",
  "Psychiatry",
];

function DoctorsDirectoryContent() {
  const searchParams = useSearchParams();
  const initialDept = searchParams.get("dept") || "All";
  const initialSearch = searchParams.get("search") || "";

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDept, setSelectedDept] = useState(initialDept);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<Doctor | null>(null);

  useEffect(() => {
    let isSubscribed = true;
    setIsLoading(true);

    doctorService
      .getAll({
        department: selectedDept !== "All" ? selectedDept : undefined,
        search: searchQuery || undefined,
      })
      .then((res) => {
        if (isSubscribed && res.success && res.data) {
          setDoctors(res.data.doctors);
        }
      })
      .catch((err) => {
        console.error("Failed to load doctors:", err);
      })
      .finally(() => {
        if (isSubscribed) setIsLoading(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [selectedDept, searchQuery]);

  return (
    <div className="w-full max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 py-8 md:py-12 space-y-8">
      {/* Page Title & Breadcrumb */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 px-3.5 py-1 text-xs font-semibold text-teal-800 dark:text-teal-300 border border-teal-500/20">
          <Stethoscope className="h-3.5 w-3.5" />
          <span>Tertiary Care Clinical Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          Find Specialist Physicians & Surgeons
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Explore internationally trained medical consultants, review visiting chambers & consultation fees, and schedule appointments online.
        </p>
      </div>

      {/* Search & Department Filters */}
      <div className="space-y-4 max-w-5xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by physician name, clinical specialty, or chamber..."
            className="pl-12 h-13 bg-white text-base shadow-sm border-slate-200 dark:bg-slate-900 dark:border-slate-800 focus-visible:ring-teal-600 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Department Pills - Fully responsive wrap preventing any tabs from being cut off */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 pt-1.5 pb-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 mr-1 shrink-0">
            <Filter className="h-3.5 w-3.5 text-teal-600" />
            <span>Specialty:</span>
          </div>
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`rounded-full px-3.5 py-1.5 sm:px-4 sm:py-2 font-semibold transition-all text-xs cursor-pointer ${
                selectedDept === dept
                  ? "bg-teal-600 text-white shadow-md shadow-teal-600/30 scale-[1.02]"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 hover:text-teal-800 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor Cards Grid */}
      {isLoading ? (
        <div className="text-center py-20 space-y-3">
          <Activity className="h-9 w-9 animate-spin text-teal-600 mx-auto" />
          <p className="text-sm font-medium text-slate-500">Connecting to clinical registry...</p>
        </div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 p-8 space-y-3 max-w-xl mx-auto">
          <Stethoscope className="h-12 w-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">No Specialist Profile Found</h3>
          <p className="text-xs sm:text-sm text-slate-500">
            No active physician profiles matched your current query &quot;{searchQuery}&quot;. Try resetting your filters.
          </p>
          <button
            onClick={() => {
              setSelectedDept("All");
              setSearchQuery("");
            }}
            className="text-xs font-bold text-teal-600 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {doctors.map((doctor) => (
            <Card
              key={doctor.id}
              className="overflow-hidden border border-slate-200/90 bg-white shadow-sm hover:shadow-xl hover:border-teal-500/60 transition-all duration-300 dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between rounded-2xl"
            >
              <CardContent className="p-6 space-y-4">
                {/* Department & Experience Pill Row */}
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="doctor" className="text-xs px-2.5 py-0.5">
                    {doctor.department}
                  </Badge>
                  <span className="text-[11px] font-semibold text-slate-400 shrink-0">
                    {doctor.experienceYears}+ Yrs Exp
                  </span>
                </div>

                {/* Doctor Name & Specialization - Full text, NO line-clamp */}
                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 leading-snug">
                    {doctor.name}
                  </h3>
                  <p className="text-xs font-semibold text-teal-700 dark:text-teal-400 leading-relaxed">
                    {doctor.specialization}
                  </p>
                </div>

                {/* Qualifications & Chamber - Clean multi-line wrapping */}
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <div className="flex items-start gap-2">
                    <Award className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                    <span className="font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                      {doctor.qualification}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                      {doctor.roomNumber}
                    </span>
                  </div>
                </div>

                {/* Visiting Schedule */}
                <div className="rounded-xl bg-slate-50 p-3.5 text-xs space-y-2 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                    <Calendar className="h-3.5 w-3.5 text-teal-600" />
                    <span>Visiting Days:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {doctor.availableDays.map((day) => (
                      <span
                        key={day}
                        className="rounded-md bg-white px-2.5 py-0.5 text-[11px] font-semibold text-slate-700 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 shadow-2xs"
                      >
                        {day.slice(0, 3)}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 pt-0.5 font-medium">
                    <Clock className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                    <span>
                      {doctor.availableTime.start} – {doctor.availableTime.end}
                    </span>
                  </div>
                </div>

                {/* Fee & Action */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 gap-3">
                  <div className="shrink-0">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Fee</span>
                    <p className="text-lg font-black text-slate-900 dark:text-slate-100">
                      ৳{doctor.consultationFee.toLocaleString()}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => setSelectedDoctorForBooking(doctor)}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4.5 py-2.5 text-xs rounded-xl shadow-md shadow-teal-600/25 shrink-0 whitespace-nowrap cursor-pointer transition-all hover:scale-[1.02]"
                  >
                    Book Serial
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Interactive Appointment Booking Dialog */}
      <BookAppointmentDialog
        doctor={selectedDoctorForBooking}
        isOpen={selectedDoctorForBooking !== null}
        onClose={() => setSelectedDoctorForBooking(null)}
      />
    </div>
  );
}

export default function DoctorsDirectoryPage() {
  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 dark:bg-slate-950 dark:text-slate-100 selection:bg-teal-600 selection:text-white">
      {/* Top Bar */}
      <div className="border-b border-teal-900/10 bg-slate-900 text-slate-200 text-xs py-2 px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16">
        <div className="w-full max-w-[1640px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-rose-400 font-bold flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              Emergency: 10666
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-300">Appointment Helpline: +880 1567-898506</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-300">
            <span className="hidden md:inline text-teal-400">JCI Accredited Hospital</span>
            <Link href="/" className="hover:text-white">Back to Main Portal</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
        <div className="w-full max-w-[1640px] mx-auto flex h-20 items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16">
          <Link
            href="/"
            title="Back to MediCore Homepage"
            className="flex items-center gap-3 group cursor-pointer hover:opacity-90 transition-opacity"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md shadow-teal-600/30 group-hover:bg-teal-700 transition-colors">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  MediCore
                </span>
                <span className="rounded bg-teal-50 px-1.5 py-0.5 text-[10px] font-bold text-teal-700 border border-teal-200 dark:bg-teal-950 dark:border-teal-800 dark:text-teal-300">
                  DOCTORS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Physician & Consultant Registry</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "border-slate-300 font-semibold"
              )}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className={cn(
                buttonVariants({ size: "sm" }),
                "bg-teal-600 hover:bg-teal-700 text-white font-semibold"
              )}
            >
              Patient Register
            </Link>
          </div>
        </div>
      </header>

      {/* Content Wrapped in Suspense */}
      <Suspense fallback={
        <div className="text-center py-20">
          <Activity className="h-8 w-8 animate-spin text-teal-600 mx-auto" />
          <p className="text-sm text-slate-500 mt-2">Loading Directory...</p>
        </div>
      }>
        <DoctorsDirectoryContent />
      </Suspense>

      {/* Simple Hospital Directory Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900">
        <p>© 2026 MediCore Hospital & Research Center. 24/7 Helpline: +880 1567-898506</p>
      </footer>
    </div>
  );
}
