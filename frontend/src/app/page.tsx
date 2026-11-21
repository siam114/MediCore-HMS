"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  Phone,
  Clock,
  MapPin,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
  Brain,
  Baby,
  Bone,
  Search,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Sparkles,
  Users,
  Award,
  ChevronRight,
  Menu,
  X,
  Ambulance,
  Building,
  FileText,
  BadgeAlert,
  Star,
  ExternalLink,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const CLINICAL_DEPARTMENTS = [
  {
    name: "Cardiology & Heart Center",
    icon: HeartPulse,
    doctorsCount: 14,
    description: "24/7 Emergency Cath Lab, coronary angioplasty, pacemaker clinic, and advanced bypass surgery.",
    query: "Cardiology",
    badge: "24/7 Cath Lab",
  },
  {
    name: "Neurology & Spine Care",
    icon: Brain,
    doctorsCount: 10,
    description: "Comprehensive stroke unit, neuro-rehabilitation, brain surgery, and minimally invasive spine care.",
    query: "Neurology",
    badge: "Stroke Unit",
  },
  {
    name: "Pediatrics & Neonatology",
    icon: Baby,
    doctorsCount: 12,
    description: "Level-3 NICU & PICU with round-the-clock pediatric emergency and neonatal intensive care.",
    query: "Pediatrics",
    badge: "NICU Level 3",
  },
  {
    name: "Orthopedics & Joint Clinic",
    icon: Bone,
    doctorsCount: 8,
    description: "Robotic assisted knee & hip replacement, sports medicine, trauma surgery, and arthroscopy.",
    query: "Orthopedics",
    badge: "Robotic Surgery",
  },
  {
    name: "Nephrology & Dialysis",
    icon: Stethoscope,
    doctorsCount: 6,
    description: "State-of-the-art 30-bed dialysis unit, kidney disease management, and transplant follow-up.",
    query: "General Medicine",
    badge: "24-Hr Dialysis",
  },
  {
    name: "General & Laparoscopic Surgery",
    icon: Activity,
    doctorsCount: 11,
    description: "Minimally invasive laparoscopic surgery, surgical oncology, and modular laminar flow OTs.",
    query: "General Surgery",
    badge: "Modular OT",
  },
];

const HOSPITAL_STATS = [
  { value: "120+", label: "Specialist Physicians", sub: "Internationally Board-Certified" },
  { value: "450+", label: "Inpatient Beds", sub: "50+ Modular Intensive Care ICUs" },
  { value: "24/7", label: "Emergency & Trauma", sub: "Dedicated Stroke & Cardiac Response" },
  { value: "99.4%", label: "Patient Satisfaction", sub: "Verified Clinical Outcome Rate" },
];

const HOSPITAL_FEATURES = [
  {
    title: "24/7 Rapid Emergency & Trauma",
    description: "Level-1 emergency department with dedicated trauma resuscitation bays, cardiac monitoring, and immediate ambulance dispatch.",
    icon: Ambulance,
  },
  {
    title: "High-Resolution Diagnostic Imaging",
    description: "Latest generation 3T High-Field MRI, 128-Slice Low-Dose Dual Energy CT scanner, and digital color Doppler ultrasonography.",
    icon: Sparkles,
  },
  {
    title: "Infection-Controlled Modular OTs",
    description: "Ultra-clean laminar airflow surgical theaters equipped for complex cardiac, neuro, robotic, and orthopedic procedures.",
    icon: ShieldCheck,
  },
  {
    title: "Paperless Digital Health Records",
    description: "Instant access to prescriptions, doctor visiting schedules, diagnostic lab test results, and billing receipts through our patient portal.",
    icon: FileText,
  },
];

const PATIENT_TESTIMONIALS = [
  {
    quote: "The cardiology emergency team saved my father during a midnight heart crisis. The angioplasty was completed in under 45 minutes with extreme professionalism.",
    author: "Mahmudur Rahman",
    relation: "Son of Cardiac Patient",
    rating: 5,
    department: "Department of Cardiology",
  },
  {
    quote: "Exceptional pediatric care. The doctors and nursing staff in the pediatric unit treated my daughter with so much tenderness and warmth during her recovery.",
    author: "Farhana Chowdhury",
    relation: "Mother of 5-year-old Patient",
    rating: 5,
    department: "Pediatrics & Child Health",
  },
  {
    quote: "Booking specialist doctors through MediCore portal was seamless. Clean hospital environment, zero waiting chaos, and clear prescription instructions.",
    author: "Zubair Al-Mamun",
    relation: "Orthopedic Patient",
    rating: 5,
    department: "Orthopedic & Joint Center",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchDoctor, setSearchDoctor] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchDoctor.trim()) {
      router.push(`/doctors?search=${encodeURIComponent(searchDoctor.trim())}`);
    } else if (selectedDept !== "All") {
      router.push(`/doctors?dept=${encodeURIComponent(selectedDept)}`);
    } else {
      router.push("/doctors");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100 selection:bg-teal-600 selection:text-white">
      {/* 1. TOP ANNOUNCEMENT & ACCREDITATION BAR */}
      <div className="border-b border-teal-900/10 bg-slate-900 text-slate-200 text-xs py-2 px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16">
        <div className="w-full max-w-[1640px] mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          {/* Left: Emergency Hotline & Location */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <div className="flex items-center gap-1.5 font-semibold text-rose-400">
              <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              <Phone className="h-3.5 w-3.5" />
              <span>24/7 Emergency & Ambulance:</span>
              <a href="tel:10666" className="text-white hover:underline underline-offset-2 font-bold tracking-wide">
                10666
              </a>
            </div>
            <span className="hidden sm:inline text-slate-600">|</span>
            <div className="hidden sm:flex items-center gap-1 text-slate-300">
              <Phone className="h-3.5 w-3.5 text-teal-400" />
              <span>Helpline:</span>
              <a href="tel:+8809610010666" className="hover:text-white transition-colors">
                +880 9610-010666
              </a>
            </div>
            <span className="hidden lg:inline text-slate-600">|</span>
            <div className="hidden lg:flex items-center gap-1 text-slate-400">
              <MapPin className="h-3.5 w-3.5 text-teal-400" />
              <span>Plot 81, Block E, Bashundhara R/A, Dhaka-1229</span>
            </div>
          </div>

          {/* Right: Hospital Accreditations & Fast Links */}
          <div className="flex items-center gap-3 text-[11px] text-slate-300">
            <div className="hidden xl:flex items-center gap-1.5 text-teal-300 font-medium bg-teal-950/80 px-2.5 py-0.5 rounded-full border border-teal-800/40">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-400" />
              <span>JCI Accredited & ISO 9001:2015 Hospital</span>
            </div>
            <span className="hidden xl:inline text-slate-700">|</span>
            <Link href="/login" className="hover:text-teal-300 transition-colors">
              Patient Portal
            </Link>
            <span className="text-slate-700">|</span>
            <Link href="/login" className="hover:text-teal-300 transition-colors">
              Doctor Access
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN HOSPITAL HEADER & NAVIGATION */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs dark:border-slate-800 dark:bg-slate-900/95">
        <div className="w-full max-w-[1640px] mx-auto flex h-20 items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16">
          {/* Hospital Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600 text-white shadow-lg shadow-teal-600/30 group-hover:bg-teal-700 transition-all">
              <Activity className="h-7 w-7" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50 font-sans">
                  MediCore
                </span>
                <span className="rounded-md bg-teal-50 px-1.5 py-0.5 text-[10px] font-bold text-teal-700 border border-teal-200 dark:bg-teal-950 dark:border-teal-800 dark:text-teal-300">
                  HOSPITALS
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 tracking-wide dark:text-slate-400">
                Tertiary Care & Specialist Research Center
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              href="/doctors"
              className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-teal-600 hover:bg-teal-50/70 rounded-lg transition-all dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-teal-400"
            >
              Find Specialist Doctors
            </Link>
            <a
              href="#departments"
              className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-teal-600 hover:bg-teal-50/70 rounded-lg transition-all dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-teal-400"
            >
              Clinical Specialties
            </a>
            <a
              href="#emergency"
              className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-teal-600 hover:bg-teal-50/70 rounded-lg transition-all dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-teal-400"
            >
              24/7 Trauma & Emergency
            </a>
            <a
              href="#why-us"
              className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-teal-600 hover:bg-teal-50/70 rounded-lg transition-all dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-teal-400"
            >
              Why MediCore
            </a>
            <a
              href="#testimonials"
              className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-teal-600 hover:bg-teal-50/70 rounded-lg transition-all dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-teal-400"
            >
              Patient Reviews
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="tel:10666"
              className="hidden xl:inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 border border-rose-200 dark:bg-rose-950/60 dark:border-rose-900 dark:text-rose-300 transition-colors"
            >
              <Ambulance className="h-4 w-4 text-rose-600 animate-pulse" />
              <span>Ambulance 10666</span>
            </a>

            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "border-slate-300 font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200"
              )}
            >
              Portal Sign In
            </Link>

            <Link
              href="/doctors"
              className={cn(
                buttonVariants({ size: "sm" }),
                "bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-md shadow-teal-600/20"
              )}
            >
              Book Appointment
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-6 py-6 space-y-4 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col space-y-2">
              <Link
                href="/doctors"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800"
              >
                Find Specialist Doctors
              </Link>
              <a
                href="#departments"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800"
              >
                Clinical Departments & Centers
              </a>
              <a
                href="#emergency"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800"
              >
                24/7 Emergency & ICU
              </a>
              <a
                href="#why-us"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800"
              >
                Hospital Infrastructure & Technology
              </a>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <a
                href="tel:10666"
                className="flex items-center justify-center gap-2 rounded-lg bg-rose-600 py-3 text-sm font-bold text-white shadow-sm"
              >
                <Ambulance className="h-4 w-4" />
                Emergency Hotline: 10666
              </a>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-lg border border-slate-300 py-2.5 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-lg bg-teal-600 py-2.5 text-sm font-semibold text-white shadow-sm"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 3. HERO SECTION WITH DOCTOR SEARCH */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/60 via-slate-50 to-white dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950 py-12 md:py-20 lg:py-24">
        {/* Subtle hospital geometry background */}
        <div className="absolute inset-0 bg-[radial-gradient(#0d9488_1px,transparent_1px)] opacity-[0.07] [background-size:24px_24px] pointer-events-none" />

        <div className="relative w-full max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Hospital Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-teal-600/10 px-3.5 py-1.5 text-xs font-semibold text-teal-800 dark:bg-teal-500/10 dark:text-teal-300 border border-teal-600/20">
                <Sparkles className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                <span>Premier Tertiary Healthcare & Super Specialty Hospital</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                World-Class Clinical Care,{" "}
                <span className="text-teal-600 dark:text-teal-400 underline decoration-teal-500/30 decoration-wavy">
                  Compassionate
                </span>{" "}
                Healing.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed font-normal">
                MediCore Hospitals brings together over 120+ internationally board-certified specialists, 24/7 round-the-clock emergency trauma response, high-precision 3T MRI diagnostics, and 50 modular ICUs to deliver exceptional healthcare in Bangladesh.
              </p>

              {/* Quick Action Doctor Search Box */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <Stethoscope className="h-4 w-4 text-teal-600" />
                  <span>Find Your Specialist Doctor or Department</span>
                </div>

                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch gap-2.5">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="Doctor name, specialty, or condition (e.g. Heart, Spine, Child)..."
                      value={searchDoctor}
                      onChange={(e) => setSearchDoctor(e.target.value)}
                      className="pl-10 h-12 bg-slate-50/70 border-slate-200 dark:bg-slate-800/80 dark:border-slate-700 text-sm focus-visible:ring-teal-600"
                    />
                  </div>

                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="h-12 rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 text-xs sm:text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  >
                    <option value="All">All Specialties</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="General Surgery">General Surgery</option>
                    <option value="Dermatology">Dermatology</option>
                  </select>

                  <Button
                    type="submit"
                    className="h-12 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 shadow-md shadow-teal-600/20 whitespace-nowrap"
                  >
                    Search Doctors
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>

                {/* Popular Search Badges */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                  <span className="text-slate-400 font-medium">Quick Search:</span>
                  {["Cardiology", "Neurology", "Pediatrics", "Orthopedics"].map((dept) => (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => router.push(`/doctors?dept=${dept}`)}
                      className="rounded-md bg-slate-100 hover:bg-teal-50 px-2 py-0.5 text-slate-600 hover:text-teal-700 transition-colors dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-teal-950 dark:hover:text-teal-300 font-medium text-[11px]"
                    >
                      #{dept}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>JCI Quality Standard</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Immediate Appointment Confirmation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>24/7 Digital Health Records</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hospital Quick Cards & Emergency Response Card */}
            <div className="lg:col-span-5 space-y-4">
              {/* Emergency Response Box */}
              <div className="rounded-2xl border-2 border-rose-200 bg-gradient-to-br from-rose-50 via-white to-rose-50/50 p-6 shadow-xl dark:border-rose-900/60 dark:from-rose-950/40 dark:via-slate-900 dark:to-rose-950/20 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-2.5 py-0.5 text-[11px] font-bold text-white uppercase tracking-wider">
                      Immediate Response
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      24/7 Emergency & ICU Care
                    </h3>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 dark:bg-rose-950">
                    <Ambulance className="h-6 w-6 animate-pulse" />
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Our emergency center is staffed 24 hours with certified critical-care physicians, rapid catheterization response, and fully equipped ICU ambulances.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <a
                    href="tel:10666"
                    className="flex flex-col items-center justify-center rounded-xl bg-rose-600 p-3 text-white shadow-md hover:bg-rose-700 transition-colors text-center"
                  >
                    <span className="text-[11px] font-medium text-rose-100">Emergency Hotline</span>
                    <span className="text-lg font-black tracking-wide">10666</span>
                  </a>

                  <a
                    href="tel:+8809610010666"
                    className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-3 text-slate-800 hover:bg-slate-50 transition-colors text-center dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    <span className="text-[11px] font-medium text-slate-400">Doctor Helpline</span>
                    <span className="text-sm font-bold">09610-010666</span>
                  </a>
                </div>
              </div>

              {/* Fast Clinic Service Links */}
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/doctors"
                  className="rounded-xl border border-slate-200/80 bg-white p-4 hover:border-teal-500/50 hover:shadow-md transition-all group dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="h-9 w-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-2 group-hover:bg-teal-600 group-hover:text-white transition-colors dark:bg-teal-950 dark:text-teal-400">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Doctor Schedule</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Explore visiting hours & chamber</p>
                </Link>

                <Link
                  href="/login"
                  className="rounded-xl border border-slate-200/80 bg-white p-4 hover:border-teal-500/50 hover:shadow-md transition-all group dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="h-9 w-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-2 group-hover:bg-sky-600 group-hover:text-white transition-colors dark:bg-sky-950 dark:text-sky-400">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Digital Health Portal</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Prescriptions & live reports</p>
                </Link>
              </div>
            </div>
          </div>

          {/* 4. HOSPITAL KEY STATS BAR */}
          <div className="mt-14 sm:mt-18 rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-md p-6 sm:p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900/80">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800">
              {HOSPITAL_STATS.map((stat, idx) => (
                <div key={idx} className={cn("text-center space-y-1", idx > 0 ? "pt-4 sm:pt-0" : "")}>
                  <p className="text-3xl sm:text-4xl font-black text-teal-600 dark:text-teal-400 tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {stat.label}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {stat.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. CLINICAL CENTERS OF EXCELLENCE / DEPARTMENTS */}
      <section id="departments" className="py-16 md:py-24 bg-white dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800">
        <div className="w-full max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                Specialized Clinical Excellence
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Centers of Medical Excellence
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                Offering specialized care across all major medical and surgical disciplines, backed by advanced diagnostic labs and multidisciplinary medical boards.
              </p>
            </div>

            <Link
              href="/doctors"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "border-slate-300 text-teal-700 hover:bg-teal-50 self-start md:self-auto font-semibold dark:border-slate-700 dark:text-teal-300"
              )}
            >
              View All 120+ Doctors
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>

          {/* Department Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CLINICAL_DEPARTMENTS.map((dept, index) => {
              const Icon = dept.icon;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 hover:bg-white hover:border-teal-500 hover:shadow-xl transition-all duration-300 group dark:border-slate-800 dark:bg-slate-900/80 dark:hover:bg-slate-850 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="h-12 w-12 rounded-xl bg-teal-600/10 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors dark:bg-teal-500/10 dark:text-teal-400">
                        <Icon className="h-6 w-6" />
                      </div>
                      <Badge variant="outline" className="text-[10px] font-semibold border-teal-600/30 text-teal-700 dark:text-teal-300">
                        {dept.badge}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-600 dark:text-white dark:group-hover:text-teal-400 transition-colors">
                        {dept.name}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                        {dept.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 mt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {dept.doctorsCount} Specialists Active
                    </span>

                    <Link
                      href={`/doctors?dept=${encodeURIComponent(dept.query)}`}
                      className="inline-flex items-center text-xs font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400 group-hover:translate-x-1 transition-all"
                    >
                      Book Specialist
                      <ChevronRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE MEDICORE - INFRASTRUCTURE & SAFETY */}
      <section id="why-us" className="py-16 md:py-24 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800">
        <div className="w-full max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Hospital Infrastructure & Patient Safety
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Why Patients Trust MediCore
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Built in accordance with international healthcare building codes, stringent infection control measures, and real-time biometric patient monitoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOSPITAL_FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-lg transition-all dark:border-slate-800 dark:bg-slate-900 space-y-3"
                >
                  <div className="h-10 w-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. EMERGENCY CALLOUT BANNER */}
      <section id="emergency" className="py-12 bg-gradient-to-r from-rose-700 via-rose-600 to-red-800 text-white">
        <div className="w-full max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-0.5 text-xs font-bold uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-white animate-ping" />
              Round-The-Clock Critical Care
            </div>
            <h3 className="text-2xl sm:text-3xl font-black">
              Experiencing a Medical Emergency?
            </h3>
            <p className="text-sm text-rose-100 max-w-xl">
              Call our dedicated emergency ambulance command center immediately for critical care trauma response and stroke resuscitation.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="tel:10666"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-base font-black text-rose-700 shadow-xl hover:bg-rose-50 transition-colors"
            >
              <Phone className="h-5 w-5 text-rose-600" />
              Call Emergency 10666
            </a>
            <Link
              href="/doctors"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/80 px-5 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition-colors"
            >
              Browse Doctor Chamber
            </Link>
          </div>
        </div>
      </section>

      {/* 8. PATIENT STORIES & REVIEWS */}
      <section id="testimonials" className="py-16 md:py-24 bg-white dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800">
        <div className="w-full max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Verified Clinical Outcomes
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Patient Care Experiences
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Hear directly from our patients and families about their medical treatment, surgery recovery, and consultations at MediCore.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PATIENT_TESTIMONIALS.map((review, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(review.rating)].map((_, s) => (
                      <Star key={s} className="h-4 w-4 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                    &ldquo;{review.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 space-y-0.5">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {review.author}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {review.relation} • <span className="text-teal-600 dark:text-teal-400 font-medium">{review.department}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. REAL HOSPITAL COMPREHENSIVE FOOTER */}
      <footer className="border-t border-slate-200 bg-slate-900 text-slate-300 pt-16 pb-12 dark:border-slate-800 dark:bg-slate-950">
        <div className="w-full max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Col 1: Brand & Bio */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xl font-black text-white tracking-tight">MediCore Hospitals</span>
                  <p className="text-xs text-teal-400 font-medium">Tertiary Care & Specialist Research Center</p>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                MediCore Hospital & Research Center is a premier multi-disciplinary hospital in Dhaka, committed to international clinical protocols, modern diagnostic imaging, and compassionate patient care.
              </p>

              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-teal-400 shrink-0" />
                  <span>Plot 81, Block E, Bashundhara R/A, Dhaka-1229, Bangladesh</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-teal-400 shrink-0" />
                  <span>Emergency: 10666 | General Helpline: +880 9610-010666</span>
                </div>
              </div>
            </div>

            {/* Col 2: Clinical Departments */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Clinical Centers</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><Link href="/doctors?dept=Cardiology" className="hover:text-teal-300">Cardiology & Cath Lab</Link></li>
                <li><Link href="/doctors?dept=Neurology" className="hover:text-teal-300">Neurology & Stroke Unit</Link></li>
                <li><Link href="/doctors?dept=Pediatrics" className="hover:text-teal-300">Pediatrics & Neonatal Care</Link></li>
                <li><Link href="/doctors?dept=Orthopedics" className="hover:text-teal-300">Orthopedic & Joint Clinic</Link></li>
                <li><Link href="/doctors?dept=General%20Surgery" className="hover:text-teal-300">General & Laparoscopic Surgery</Link></li>
                <li><Link href="/doctors" className="hover:text-teal-300">Full Doctor Directory</Link></li>
              </ul>
            </div>

            {/* Col 3: Patients & Visitors */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Patient Care</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><Link href="/doctors" className="hover:text-teal-300">Book Doctor Appointment</Link></li>
                <li><Link href="/login" className="hover:text-teal-300">Patient Portal Sign In</Link></li>
                <li><Link href="/register" className="hover:text-teal-300">Online Patient Registration</Link></li>
                <li><a href="#emergency" className="hover:text-teal-300">24/7 Ambulance Service</a></li>
                <li><span className="text-slate-500">Corporate Health Checkups</span></li>
                <li><span className="text-slate-500">Hospital Visitor Guidelines</span></li>
              </ul>
            </div>

            {/* Col 4: Quality & Accreditation */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quality Accreditations</h4>
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>JCI Gold Seal Standards</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>ISO 9001:2015 Hospital Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>DGHS Licensed Care Provider</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs"
                  )}
                >
                  Doctor & Staff Sign In
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© 2026 MediCore Hospital & Research Center Ltd. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>Patient Privacy Policy</span>
              <span>Terms of Healthcare</span>
              <span>Patient Rights Charter</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
