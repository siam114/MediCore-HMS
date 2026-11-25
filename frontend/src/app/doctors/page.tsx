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
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Microscope,
  Users,
  FileText,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { doctorService } from "@/services/api";
import { BookAppointmentDialog } from "@/components/appointments/BookAppointmentDialog";
import { MediCoreLogoIcon, MediCoreLoader } from "@/components/shared";
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
        <div className="py-20 flex justify-center">
          <MediCoreLoader size={56} text="Connecting to clinical physician registry..." />
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll state for shadow & glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 dark:bg-slate-950 dark:text-slate-100 selection:bg-teal-600 selection:text-white">
      {/* Top Bar */}
      <div className="border-b border-teal-900/10 bg-slate-900 text-slate-200 text-xs py-2 px-3 sm:px-6 md:px-8 lg:px-12 2xl:px-16 overflow-hidden">
        <div className="w-full max-w-[1640px] mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs">
            <span className="text-rose-400 font-bold flex items-center gap-1.5 shrink-0">
              <Phone className="h-3.5 w-3.5" />
              Emergency: 10666
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-300">Helpline: +880 1567-898506</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-[11px] text-slate-300">
            <span className="hidden md:inline text-teal-400">JCI Accredited Hospital</span>
            <Link href="/" className="hover:text-white transition-colors">Back to Main Portal</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={cn(
          "sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 transition-shadow duration-200",
          isScrolled ? "shadow-md" : ""
        )}
      >
        <div className="w-full max-w-[1640px] mx-auto flex h-16 sm:h-20 items-center justify-between px-3 sm:px-6 md:px-8 lg:px-12 2xl:px-16 gap-2">
          <Link
            href="/"
            title="Back to MediCore Homepage"
            className="flex items-center gap-2 sm:gap-3 group cursor-pointer hover:opacity-90 transition-opacity min-w-0"
          >
            <MediCoreLogoIcon size={38} className="sm:w-[42px] sm:h-[42px] group-hover:scale-105 transition-transform shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-xl font-black text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors truncate">
                  MediCore
                </span>
                <span className="rounded bg-teal-50 px-1 sm:px-1.5 py-0.5 text-[8px] sm:text-[10px] font-bold text-teal-700 border border-teal-200 dark:bg-teal-950 dark:border-teal-800 dark:text-teal-300 shrink-0">
                  DOCTORS
                </span>
              </div>
              <p className="hidden sm:block text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">Physician Registry</p>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "hidden sm:inline-flex border-slate-300 font-semibold text-xs h-9 px-3.5 rounded-xl"
              )}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className={cn(
                buttonVariants({ size: "sm" }),
                "hidden sm:inline-flex bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs h-9 px-3.5 rounded-xl"
              )}
            >
              Patient Register
            </Link>

            {/* Mobile / Tablet Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden inline-flex items-center justify-center h-8.5 w-8.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 transition-colors cursor-pointer shrink-0"
              aria-label="Open Navigation Sidebar"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MOBILE & TABLET SLIDE-OVER SIDEBAR DRAWER - STANDALONE VIEWPORT           */}
      {/* ========================================================================= */}
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-[99] bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 lg:hidden",
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-over Sidebar Drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-[100] w-full max-w-[320px] sm:max-w-[380px] h-screen h-dvh bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:hidden",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Hospital Navigation Menu"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <MediCoreLogoIcon size={36} className="shrink-0" />
            <div className="min-w-0">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-slate-50">
                MediCore HMS
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
                Clinical Registry & Portal
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 dark:hover:bg-slate-800 dark:hover:text-slate-100 transition-colors cursor-pointer shrink-0"
            aria-label="Close Navigation Sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-4">
          {/* Emergency Card */}
          <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100/70 p-3.5 border border-rose-200 dark:from-rose-950/40 dark:to-rose-900/20 dark:border-rose-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                24/7 Ambulance Line
              </span>
              <span className="rounded-full bg-rose-600 text-white text-[9px] font-bold px-2 py-0.5">
                10666
              </span>
            </div>
            <a
              href="tel:10666"
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              Call Emergency Ambulance
            </a>
          </div>

          {/* Full Hospital Navigation Links */}
          <div className="space-y-1">
            <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Hospital Exploration
            </p>

            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:text-teal-700 hover:bg-teal-50/80 dark:text-slate-100 dark:hover:bg-slate-800/80 dark:hover:text-teal-300 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
                  <Activity className="h-4 w-4" />
                </div>
                <span>Main Hospital Home</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-teal-600" />
            </Link>

            <Link
              href="/doctors"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold bg-teal-50/80 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white">
                  <Stethoscope className="h-4 w-4" />
                </div>
                <span>Find Specialist Doctors</span>
              </div>
              <ChevronRight className="h-4 w-4 text-teal-600" />
            </Link>

            <Link
              href="/#departments"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:text-teal-700 hover:bg-teal-50/80 dark:text-slate-100 dark:hover:bg-slate-800/80 dark:hover:text-teal-300 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
                  <HeartPulse className="h-4 w-4" />
                </div>
                <span>Clinical Specialties & Centers</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-teal-600" />
            </Link>

            <Link
              href="/#health-packages"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:text-teal-700 hover:bg-teal-50/80 dark:text-slate-100 dark:hover:bg-slate-800/80 dark:hover:text-teal-300 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span>Preventive Health Packages</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-teal-600" />
            </Link>

            <Link
              href="/#technology"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:text-teal-700 hover:bg-teal-50/80 dark:text-slate-100 dark:hover:bg-slate-800/80 dark:hover:text-teal-300 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
                  <Microscope className="h-4 w-4" />
                </div>
                <span>Hospital Technology & OTs</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-teal-600" />
            </Link>

            <Link
              href="/#emergency-unit"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-700 hover:bg-rose-50/80 dark:text-rose-400 dark:hover:bg-rose-950/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                  <Ambulance className="h-4 w-4" />
                </div>
                <span>24/7 Emergency & ICU Care</span>
              </div>
              <ChevronRight className="h-4 w-4 text-rose-400 group-hover:text-rose-600" />
            </Link>

            <Link
              href="/#patient-care"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:text-teal-700 hover:bg-teal-50/80 dark:text-slate-100 dark:hover:bg-slate-800/80 dark:hover:text-teal-300 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
                  <Users className="h-4 w-4" />
                </div>
                <span>Patient Guide & Admission</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-teal-600" />
            </Link>

            <Link
              href="/#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:text-teal-700 hover:bg-teal-50/80 dark:text-slate-100 dark:hover:bg-slate-800/80 dark:hover:text-teal-300 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
                  <FileText className="h-4 w-4" />
                </div>
                <span>Frequently Asked Questions</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-teal-600" />
            </Link>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 space-y-2.5 shrink-0">
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold text-xs text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition-colors"
            >
              Portal Sign In
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors shadow-xs"
            >
              Register Patient
            </Link>
          </div>
        </div>
      </aside>

      {/* Content Wrapped in Suspense */}
      <Suspense fallback={
        <div className="min-h-[50vh] flex items-center justify-center py-20">
          <MediCoreLoader size={64} text="Loading physician profiles..." />
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
