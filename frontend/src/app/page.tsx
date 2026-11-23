"use client";

import { useState, useEffect } from "react";
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
  ChevronDown,
  Microscope,
  BedDouble,
  Heart,
  Pill,
  Globe,
  Building2,
  ShieldAlert,
  FileCheck,
  Plane,
  Syringe,
  Check,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MediCoreLogoIcon } from "@/components/shared";

// 1. Core Clinical Centers of Excellence
const CLINICAL_DEPARTMENTS = [
  {
    name: "Cardiology & Cardiac Surgery",
    icon: HeartPulse,
    doctorsCount: 16,
    description: "24/7 Primary Emergency Cath Lab, coronary angioplasty, pacemaker clinic, and minimally invasive bypass surgery.",
    query: "Cardiology",
    badge: "24/7 Cath Lab",
    highlight: "Door-to-balloon time < 45 mins",
  },
  {
    name: "Neurology & Spine Surgery",
    icon: Brain,
    doctorsCount: 12,
    description: "Comprehensive acute stroke unit, neuro-rehabilitation, micro-neurosurgery, and endoscopic brain & spine care.",
    query: "Neurology",
    badge: "Stroke Unit",
    highlight: "Advanced 3T Neuro-Navigation",
  },
  {
    name: "Pediatrics & Neonatology",
    icon: Baby,
    doctorsCount: 14,
    description: "Level-3 NICU & PICU with round-the-clock neonatal emergency, child cardiology, and developmental pediatrics.",
    query: "Pediatrics",
    badge: "NICU Level 3",
    highlight: "50-Bed Dedicated Neonatal Wing",
  },
  {
    name: "Orthopedics & Joint Care",
    icon: Bone,
    doctorsCount: 10,
    description: "Computer & robotic assisted knee & hip replacement, sports arthroscopy, complex pelvis fracture, and trauma care.",
    query: "Orthopedics",
    badge: "Robotic Surgery",
    highlight: "Fast-Track Joint Recovery Protocol",
  },
  {
    name: "Nephrology & 24/7 Dialysis",
    icon: Stethoscope,
    doctorsCount: 8,
    description: "State-of-the-art 30-bed hemodialysis unit, CRRT, peritoneal dialysis, kidney biopsy, and transplant follow-up.",
    query: "General Medicine",
    badge: "30-Bed Dialysis",
    highlight: "Zero-Infection Water Treatment Plant",
  },
  {
    name: "General & Laparoscopic Surgery",
    icon: Activity,
    doctorsCount: 12,
    description: "Laparoscopic gastrointestinal surgery, hernia repair, surgical oncology, and infection-controlled laminar flow OTs.",
    query: "General Surgery",
    badge: "Modular OT",
    highlight: "Day-Care Minimally Invasive Surgery",
  },
  {
    name: "Dermatology & Skin Center",
    icon: Sparkles,
    doctorsCount: 6,
    description: "Clinical dermatology, phototherapy, laser skin treatments, allergy testing, and chronic psoriasis clinic.",
    query: "Dermatology",
    badge: "Laser Clinic",
    highlight: "State-of-the-Art Dermatosurgery",
  },
  {
    name: "Oncology & Cancer Institute",
    icon: Syringe,
    doctorsCount: 9,
    description: "Comprehensive medical and surgical oncology, day-care chemotherapy unit, and molecular genetic tumor boards.",
    query: "General Surgery",
    badge: "Cancer Center",
    highlight: "Multidisciplinary Tumor Board",
  },
];

// 2. Hospital Stats
const HOSPITAL_STATS = [
  { value: "120+", label: "Specialist Physicians", sub: "Internationally Board-Certified" },
  { value: "450+", label: "Inpatient Beds", sub: "50+ Modular Smart ICUs" },
  { value: "25,000+", label: "Surgeries Completed", sub: "99.4% Verified Clinical Success" },
  { value: "24/7", label: "Emergency & Trauma", sub: "Dedicated Stroke & Cardiac Units" },
];

// 3. Preventive Health Packages
const HEALTH_PACKAGES = [
  {
    id: "executive-cardiac",
    name: "Executive Cardiac Wellness",
    tag: "Most Popular",
    price: 6500,
    testsCount: 22,
    description: "Designed for proactive cardiovascular evaluation, early coronary risk detection, and lipid profile screening.",
    features: [
      "2D Color Doppler Echocardiogram",
      "Treadmill Stress Test (TMT / Exercise ECG)",
      "Comprehensive Lipid Profile & Hs-CRP",
      "HbA1c & Fasting Blood Sugar",
      "Kidney Function (Serum Creatinine & Urea)",
      "Senior Cardiologist Consultation",
    ],
  },
  {
    id: "comprehensive-master",
    name: "Whole Body Master Checkup",
    tag: "Comprehensive",
    price: 9800,
    testsCount: 48,
    description: "Complete head-to-toe clinical assessment covering vital organs: heart, liver, kidneys, lungs, and metabolic profile.",
    features: [
      "Ultrasonography of Whole Abdomen & Pelvis",
      "Chest X-Ray Digital & Pulmonary Function Test",
      "Liver Function (Bilirubin, SGOT, SGPT, Alk Phos)",
      "Kidney & Thyroid Profile (TSH, FT4)",
      "Complete Blood Count (CBC with ESR)",
      "General Physician & Dietician Consultation",
    ],
  },
  {
    id: "senior-citizen",
    name: "Senior Citizen Care Package",
    tag: "Ages 55+",
    price: 8200,
    testsCount: 36,
    description: "Specialized geriatric screening tailored for bone density, arthritis, prostate health, and cardiovascular risk.",
    features: [
      "Bone Mineral Density (DEXA Scan)",
      "Serum Calcium, Vitamin D3 & Uric Acid",
      "PSA (Prostate Specific Antigen) for Men",
      "Cardiac ECG & Echocardiogram",
      "Electrolyte Panel (Sodium, Potassium, Chloride)",
      "Geriatric Specialist Consultation",
    ],
  },
  {
    id: "women-wellness",
    name: "Women's Comprehensive Wellness",
    tag: "Women's Health",
    price: 7500,
    testsCount: 32,
    description: "Holistic health assessment for women of all ages with specialized breast, cervical, and hormonal screenings.",
    features: [
      "Digital Bilateral Breast Ultrasound / Mammogram",
      "Liquid Based Cervical Pap Smear",
      "Pelvic Ultrasound (Uterus & Ovaries)",
      "Complete Thyroid & Hormonal Panel",
      "Serum Iron & Ferritin Screening",
      "Consultant Gynecologist Review",
    ],
  },
];

// 4. Cutting Edge Technology
const HOSPITAL_TECHNOLOGIES = [
  {
    name: "Siemens Magnetom 3T Silent MRI",
    category: "Diagnostic Radiology",
    desc: "Ultra-high field 3 Tesla scanner offering crystal-clear brain, spine, and musculoskeletal imaging with 70% acoustic noise reduction.",
    badge: "Ultra-High 3T",
  },
  {
    name: "GE 128-Slice Dual-Energy Cardiac CT",
    category: "Cardiovascular Imaging",
    desc: "Rapid non-invasive coronary angiogram capturing the whole heart in less than 5 cardiac cycles with ultra-low radiation doses.",
    badge: "Low Radiation",
  },
  {
    name: "Modular Class-100 Laminar OTs",
    category: "Surgical Suites",
    desc: "Hermetically sealed surgical suites with HEPA filtration providing 99.97% pathogen-free airflow for complex open-heart and joint surgeries.",
    badge: "Infection-Free",
  },
  {
    name: "Bi-Plane Digital Cath Lab",
    category: "Interventional Suite",
    desc: "State-of-the-art dual-axis fluoroscopy for complex brain aneurysm coiling, coronary angioplasty, and structural heart repairs.",
    badge: "Real-time 3D",
  },
];

// 5. Featured Specialists
const FEATURED_DOCTORS = [
  {
    name: "Dr. SM Siam",
    dept: "Cardiology & Interventional Care",
    qual: "MBBS, FCPS (Cardiology), FACC (USA)",
    chamber: "Chamber #402, Block B (4th Floor)",
    time: "05:00 PM - 09:00 PM (Sat - Wed)",
    fee: 1500,
    exp: 14,
  },
  {
    name: "Dr. Nusrat Jahan",
    dept: "Neurology & Stroke Center",
    qual: "MBBS, MD (Neurology), Fellow Stroke (Singapore)",
    chamber: "Chamber #308, Block A (3rd Floor)",
    time: "06:00 PM - 09:30 PM (Sun - Thu)",
    fee: 1400,
    exp: 12,
  },
  {
    name: "Dr. Tanvir Hasan",
    dept: "Pediatrics & Neonatal Care",
    qual: "MBBS, DCH, FCPS (Pediatrics)",
    chamber: "Chamber #210, Block C (2nd Floor)",
    time: "04:00 PM - 08:00 PM (Everyday)",
    fee: 1200,
    exp: 15,
  },
  {
    name: "Dr. Ayesha Siddiqua",
    dept: "Orthopedics & Robotic Joint Replacement",
    qual: "MBBS, MS (Ortho), Fellow Arthroscopy (UK)",
    chamber: "Chamber #505, Block B (5th Floor)",
    time: "05:30 PM - 09:00 PM (Sat - Wed)",
    fee: 1500,
    exp: 16,
  },
];

// 6. Patient Testimonials
const PATIENT_TESTIMONIALS = [
  {
    quote: "During my father's acute midnight heart crisis, the ambulance arrived in 18 minutes with full cardiac monitoring. The Cath Lab team completed the emergency angioplasty in under 40 minutes.",
    author: "Mahmudur Rahman",
    relation: "Son of Cardiac Patient (Bashundhara)",
    dept: "Department of Cardiology",
    rating: 5,
  },
  {
    quote: "My 3-year-old was admitted to the Pediatric ICU with severe pneumonia. The compassionate care of the nursing staff and doctors gave us immense strength. She made a complete recovery.",
    author: "Farhana Chowdhury",
    relation: "Mother of Pediatric Patient (Uttara)",
    dept: "Pediatrics & Neonatal Care",
    rating: 5,
  },
  {
    quote: "Had total knee replacement by Dr. Ayesha Siddiqua using robotic assistance. I was able to walk with support within 36 hours and fully returned to my morning walks in four weeks.",
    author: "Engr. Nazmul Huda",
    relation: "Orthopedic Patient (Gulshan)",
    dept: "Orthopedics & Joint Clinic",
    rating: 5,
  },
];

// 7. Frequently Asked Questions
const FAQ_ITEMS = [
  {
    q: "How do I book an emergency ambulance and what is the hotline number?",
    a: "Our emergency ambulance command center is active 24/7. You can dial our direct emergency line 10666 from any mobile or landline across Bangladesh for immediate ICU/Cardiac ambulance dispatch with trained paramedic staff.",
  },
  {
    q: "Can I download my blood test and diagnostic imaging reports online?",
    a: "Yes. All lab results, ultrasound, MRI, and CT scan reports are automatically synced to our secure Patient Portal. Simply log in with your registered phone number or email to view and download PDF reports anytime.",
  },
  {
    q: "What are the visiting hours for inpatients, ICUs, and general cabins?",
    a: "General in-patient cabins allow visitors from 04:30 PM to 06:30 PM daily (one visitor per patient at a time to maintain infection control). ICU visiting hours are strictly 11:30 AM to 12:00 PM and 05:00 PM to 05:30 PM for immediate family only.",
  },
  {
    q: "Which insurance policies and corporate cashless health cards are accepted?",
    a: "We accept cashless hospitalization for all major national and international health insurances including MetLife, Green Delta, Pragati Life, Bupa, Cigna, and over 40 corporate TPA partner networks. Our 24/7 Corporate Desk assists with pre-authorization.",
  },
  {
    q: "How can international or long-distance patients schedule consultations?",
    a: "Our International Patient Care Department assists outstation and overseas patients with preliminary tele-consultations, doctor appointment scheduling, airport ambulance pickup, and hospital guest-house arrangements.",
  },
];

// 8. Hospital News & Medical Bulletins
const HOSPITAL_NEWS = [
  {
    date: "November 18, 2026",
    category: "Clinical Milestone",
    title: "MediCore Successfully Performs 500th Robotic-Assisted Joint Replacement",
    summary: "Our Orthopedic Surgery Center reached a landmark milestone with sub-millimeter surgical accuracy and rapid patient discharge within 48 hours.",
  },
  {
    date: "November 10, 2026",
    category: "Emergency Care",
    title: "Door-to-Balloon Time Drops to Record 38 Minutes for Heart Attack Patients",
    summary: "Dedicated 24/7 rapid interventional cath lab protocols ensure life-saving artery clearance well below the international 90-minute benchmark.",
  },
  {
    date: "October 28, 2026",
    category: "Community Health",
    title: "Free Pediatric Congenital Heart Screening Camp Benefits 400+ Children",
    summary: "Pediatric cardiac team conducted comprehensive echocardiograms and health assessments for underprivileged children in Dhaka division.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchDoctor, setSearchDoctor] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Lock body scroll when mobile/tablet sidebar drawer is open
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

  // Close sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100 selection:bg-teal-600 selection:text-white">

      {/* ========================================================================= */}
      {/* SECTION 1: TOP EMERGENCY, ACCREDITATION & PATIENT ACCESS BAR              */}
      {/* ========================================================================= */}
      <div className="border-b border-teal-900/10 bg-slate-900 text-slate-200 text-xs py-2 px-3 sm:px-6 md:px-8 lg:px-12 2xl:px-16 overflow-hidden">
        <div className="w-full max-w-[1640px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2">
          {/* Emergency Hotline & Campus */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-4 text-[11px] sm:text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-rose-400">
              <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              <Phone className="h-3.5 w-3.5 shrink-0" />
              <span>24/7 Ambulance:</span>
              <a href="tel:10666" className="text-white hover:underline underline-offset-2 font-bold tracking-wide">
                10666
              </a>
            </div>
            <span className="hidden sm:inline text-slate-600">|</span>
            <div className="hidden sm:flex items-center gap-1 text-slate-300">
              <Phone className="h-3.5 w-3.5 text-teal-400 shrink-0" />
              <span>Helpline:</span>
              <a href="tel:+8801567898506" className="hover:text-white transition-colors font-medium">
                01567898506
              </a>
            </div>
            <span className="hidden lg:inline text-slate-600">|</span>
            <div className="hidden lg:flex items-center gap-1 text-slate-400">
              <MapPin className="h-3.5 w-3.5 text-teal-400 shrink-0" />
              <span>Plot 81, Block E, Bashundhara R/A, Dhaka</span>
            </div>
          </div>

          {/* Accreditations & Portals */}
          <div className="flex items-center gap-2.5 sm:gap-3 text-[10px] sm:text-[11px] text-slate-300">
            <div className="hidden xl:flex items-center gap-1.5 text-teal-300 font-medium bg-teal-950/80 px-2.5 py-0.5 rounded-full border border-teal-800/40">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-400 shrink-0" />
              <span>JCI Accredited Hospital</span>
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

      {/* ========================================================================= */}
      {/* SECTION 2: STICKY HOSPITAL MAIN NAVIGATION & RESPONSIVE SLIDE-OVER SIDEBAR */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs dark:border-slate-800 dark:bg-slate-900/95">
        <div className="w-full max-w-[1640px] mx-auto flex h-16 sm:h-20 items-center justify-between px-3 sm:px-6 md:px-8 lg:px-12 2xl:px-16 gap-2 sm:gap-4">
          {/* Logo */}
          <Link
            href="/"
            onClick={(e) => {
              if (typeof window !== "undefined" && window.location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="flex items-center gap-2 sm:gap-3 group shrink-0 cursor-pointer min-w-0"
            title="MediCore Hospitals - Back to Top / Home"
          >
            <MediCoreLogoIcon size={38} className="sm:w-[42px] sm:h-[42px] group-hover:scale-105 transition-transform shrink-0" />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-xl 2xl:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50 font-sans truncate">
                  MediCore
                </span>
                <span className="rounded bg-teal-50 px-1 sm:px-1.5 py-0.5 text-[8px] sm:text-[10px] font-bold text-teal-700 border border-teal-200 dark:bg-teal-950 dark:border-teal-800 dark:text-teal-300 shrink-0">
                  HOSPITALS
                </span>
              </div>
              <span className="hidden md:block text-[10px] sm:text-[11px] font-medium text-slate-500 tracking-wide dark:text-slate-400 truncate">
                Tertiary Care & Research Center
              </span>
            </div>
          </Link>

          {/* Desktop Nav - Clean, single-line, zero text-wrapping */}
          <nav className="hidden xl:flex items-center gap-1 2xl:gap-2 shrink-0">
            <Link
              href="/doctors"
              className="px-2.5 2xl:px-3.5 py-2 text-xs 2xl:text-sm font-semibold text-slate-700 hover:text-teal-600 hover:bg-teal-50/70 rounded-lg transition-all dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-teal-400 whitespace-nowrap"
            >
              Find Doctors
            </Link>
            <a
              href="#departments"
              className="px-2.5 2xl:px-3.5 py-2 text-xs 2xl:text-sm font-semibold text-slate-700 hover:text-teal-600 hover:bg-teal-50/70 rounded-lg transition-all dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-teal-400 whitespace-nowrap"
            >
              Specialties
            </a>
            <a
              href="#health-packages"
              className="px-2.5 2xl:px-3.5 py-2 text-xs 2xl:text-sm font-semibold text-slate-700 hover:text-teal-600 hover:bg-teal-50/70 rounded-lg transition-all dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-teal-400 whitespace-nowrap"
            >
              Health Packages
            </a>
            <a
              href="#technology"
              className="px-2.5 2xl:px-3.5 py-2 text-xs 2xl:text-sm font-semibold text-slate-700 hover:text-teal-600 hover:bg-teal-50/70 rounded-lg transition-all dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-teal-400 whitespace-nowrap"
            >
              Technology
            </a>
            <a
              href="#emergency-unit"
              className="px-2.5 2xl:px-3.5 py-2 text-xs 2xl:text-sm font-semibold text-rose-700 hover:text-rose-800 hover:bg-rose-50/70 rounded-lg transition-all dark:text-rose-400 dark:hover:bg-rose-950/40 whitespace-nowrap"
            >
              24/7 Emergency
            </a>
            <a
              href="#patient-care"
              className="px-2.5 2xl:px-3.5 py-2 text-xs 2xl:text-sm font-semibold text-slate-700 hover:text-teal-600 hover:bg-teal-50/70 rounded-lg transition-all dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-teal-400 whitespace-nowrap"
            >
              Patient Guide
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Emergency Hotline Button */}
            <a
              href="tel:10666"
              className="inline-flex items-center gap-1 sm:gap-1.5 rounded-xl bg-rose-50 px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 border border-rose-200 dark:bg-rose-950/60 dark:border-rose-900 dark:text-rose-300 transition-colors whitespace-nowrap shadow-xs"
              title="24/7 Emergency Ambulance: 10666"
            >
              <Ambulance className="h-3.5 w-3.5 text-rose-600 animate-pulse shrink-0" />
              <span>10666</span>
            </a>

            {/* Sign in - Visible on Tablets & Desktop */}
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "hidden md:inline-flex border-slate-300 font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 text-xs px-3.5 py-2 h-9 rounded-xl whitespace-nowrap shadow-xs"
              )}
            >
              Sign In
            </Link>

            {/* Book Serial - Visible on sm and up (Tablet & Desktop) */}
            <Link
              href="/doctors"
              className={cn(
                buttonVariants({ size: "sm" }),
                "hidden sm:inline-flex bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md shadow-teal-600/25 text-xs px-3 sm:px-4 py-2 h-9 rounded-xl whitespace-nowrap transition-all hover:scale-[1.02]"
              )}
            >
              Book Serial
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>

            {/* Mobile / Tablet Hamburger Menu Button - ALWAYS prominently visible on mobile and tablet */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="xl:hidden inline-flex items-center justify-center h-8.5 w-8.5 sm:h-9.5 sm:w-9.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 transition-colors shadow-xs shrink-0 cursor-pointer"
              aria-label="Open Navigation Sidebar"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MOBILE & TABLET SLIDE-OVER SIDEBAR DRAWER (SHEET) - STANDALONE VIEWPORT   */}
      {/* ========================================================================= */}
      {/* Backdrop Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-[99] bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 xl:hidden",
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-Over Drawer Container - Independent Full Viewport Height */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-[100] w-full max-w-[320px] sm:max-w-[400px] h-screen h-dvh bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out xl:hidden",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Hospital Navigation Menu"
      >
        {/* Drawer Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <MediCoreLogoIcon size={36} className="shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-slate-50">
                  MediCore
                </span>
                <span className="rounded bg-teal-50 px-1.5 py-0.5 text-[9px] font-bold text-teal-700 border border-teal-200 dark:bg-teal-950 dark:border-teal-800 dark:text-teal-300">
                  HOSPITALS
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
                Tertiary Care & Research Center
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

        {/* Drawer Body - Scrollable Links with Min Height 0 */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-4">
          {/* 24/7 Critical Hotline Card */}
          <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100/70 p-3.5 border border-rose-200 dark:from-rose-950/40 dark:to-rose-900/20 dark:border-rose-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                24/7 Ambulance Hotline
              </span>
              <span className="rounded-full bg-rose-600 text-white text-[9px] font-bold px-2 py-0.5">
                Emergency
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-black text-rose-700 dark:text-rose-300 tracking-tight">10666</p>
                <p className="text-[10px] text-rose-600/90 dark:text-rose-400/90">Direct ICU Dispatch Line</p>
              </div>
              <a
                href="tel:10666"
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3.5 py-1.5 shadow-xs transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                Call Now
              </a>
            </div>
          </div>

          {/* Navigation Group - Complete Hospital Sections */}
          <div className="space-y-1">
            <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Hospital Exploration
            </p>

            <Link
              href="/doctors"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:text-teal-700 hover:bg-teal-50/80 dark:text-slate-100 dark:hover:bg-slate-800/80 dark:hover:text-teal-300 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400 group-hover:scale-105 transition-transform">
                  <Stethoscope className="h-4 w-4" />
                </div>
                <span>Find Specialist Doctors</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
            </Link>

            <a
              href="#departments"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:text-teal-700 hover:bg-teal-50/80 dark:text-slate-100 dark:hover:bg-slate-800/80 dark:hover:text-teal-300 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400 group-hover:scale-105 transition-transform">
                  <HeartPulse className="h-4 w-4" />
                </div>
                <span>Clinical Specialties & Centers</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
            </a>

            <a
              href="#health-packages"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:text-teal-700 hover:bg-teal-50/80 dark:text-slate-100 dark:hover:bg-slate-800/80 dark:hover:text-teal-300 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400 group-hover:scale-105 transition-transform">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span>Preventive Health Packages</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
            </a>

            <a
              href="#technology"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:text-teal-700 hover:bg-teal-50/80 dark:text-slate-100 dark:hover:bg-slate-800/80 dark:hover:text-teal-300 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400 group-hover:scale-105 transition-transform">
                  <Microscope className="h-4 w-4" />
                </div>
                <span>Hospital Technology & Modular OTs</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
            </a>

            <a
              href="#emergency-unit"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-700 hover:bg-rose-50/80 dark:text-rose-400 dark:hover:bg-rose-950/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400 group-hover:scale-105 transition-transform">
                  <Ambulance className="h-4 w-4" />
                </div>
                <span>24/7 Emergency & ICU Care</span>
              </div>
              <ChevronRight className="h-4 w-4 text-rose-400 group-hover:text-rose-600 transition-colors" />
            </a>

            <a
              href="#patient-care"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:text-teal-700 hover:bg-teal-50/80 dark:text-slate-100 dark:hover:bg-slate-800/80 dark:hover:text-teal-300 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400 group-hover:scale-105 transition-transform">
                  <Users className="h-4 w-4" />
                </div>
                <span>Patient Guide & Admission</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
            </a>

            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:text-teal-700 hover:bg-teal-50/80 dark:text-slate-100 dark:hover:bg-slate-800/80 dark:hover:text-teal-300 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400 group-hover:scale-105 transition-transform">
                  <FileText className="h-4 w-4" />
                </div>
                <span>Frequently Asked Questions</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
            </a>
          </div>

          {/* Portal & Support Info */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1">
            <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Hospital Helplines
            </p>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Appointments:</span>
                <a href="tel:+8801567898506" className="font-bold text-teal-700 dark:text-teal-300 hover:underline">
                  01567898506
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Hospital Campus:</span>
                <span className="font-medium text-slate-700 dark:text-slate-200">Bashundhara, Dhaka</span>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 space-y-2.5 shrink-0">
          <Link
            href="/doctors"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/25 transition-all"
          >
            <Calendar className="h-4 w-4" />
            <span>Book Doctor Serial</span>
            <ArrowRight className="h-4 w-4 ml-auto" />
          </Link>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold text-xs text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition-colors"
            >
              Portal Sign In
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center py-2 px-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 font-semibold text-xs text-teal-700 dark:text-teal-300 hover:bg-teal-100 transition-colors"
            >
              Register Patient
            </Link>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* SECTION 3: HERO BANNER WITH INTERACTIVE DOCTOR SEARCH ENGINE              */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/60 via-slate-50 to-white dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950 py-12 md:py-20 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(#0d9488_1px,transparent_1px)] opacity-[0.06] [background-size:24px_24px] pointer-events-none" />

        <div className="relative w-full max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Hospital Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-teal-600/10 px-3.5 py-1.5 text-xs font-semibold text-teal-800 dark:bg-teal-500/10 dark:text-teal-300 border border-teal-600/20">
                <Sparkles className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                <span>Premier Tertiary Healthcare & Specialist Research Center</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                Advanced Medicine,{" "}
                <span className="text-teal-600 dark:text-teal-400 underline decoration-teal-500/30 decoration-wavy">
                  Compassionate
                </span>{" "}
                Clinical Care.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed font-normal">
                MediCore Hospitals brings together over 120+ internationally board-certified medical specialists, 24/7 acute trauma & stroke response, high-precision 3T MRI diagnostics, and 50 modular smart ICUs to deliver exceptional healthcare in Bangladesh.
              </p>

              {/* Quick Doctor Search Box */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <Stethoscope className="h-4 w-4 text-teal-600" />
                  <span>Find Your Specialist Doctor or Clinical Department</span>
                </div>

                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch gap-2.5">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="Physician name, symptom, or chamber (e.g. Heart, Spine, Pediatric)..."
                      value={searchDoctor}
                      onChange={(e) => setSearchDoctor(e.target.value)}
                      className="pl-10 h-12 bg-slate-50/70 border-slate-200 dark:bg-slate-800/80 dark:border-slate-700 text-sm focus-visible:ring-teal-600"
                    />
                  </div>

                  <div className="relative">
                    <select
                      value={selectedDept}
                      onChange={(e) => setSelectedDept(e.target.value)}
                      className="h-12 w-full appearance-none rounded-lg border border-slate-200 bg-slate-50/70 pl-4 pr-10 text-xs sm:text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer"
                    >
                      <option value="All">All Specialties</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="General Surgery">General Surgery</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="Gynecology & Obstetrics">Gynecology</option>
                      <option value="Nephrology">Nephrology</option>
                      <option value="Oncology">Oncology</option>
                      <option value="Gastroenterology">Gastroenterology</option>
                      <option value="Urology">Urology</option>
                      <option value="Ophthalmology">Ophthalmology</option>
                      <option value="ENT (Ear, Nose, Throat)">ENT</option>
                      <option value="Psychiatry">Psychiatry</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>

                  <Button
                    type="submit"
                    className="h-12 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 shadow-md shadow-teal-600/20 whitespace-nowrap"
                  >
                    Search Doctors
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>

                {/* Popular Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                  <span className="text-slate-400 font-medium">Frequent Inquiries:</span>
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

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>JCI Hospital Safety Protocols</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Instant SMS/Email Serial Confirmation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>24/7 Digital Health Records</span>
                </div>
              </div>
            </div>

            {/* Right Column: Emergency & Fast Action Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl border-2 border-rose-200 bg-gradient-to-br from-rose-50 via-white to-rose-50/50 p-6 shadow-xl dark:border-rose-900/60 dark:from-rose-950/40 dark:via-slate-900 dark:to-rose-950/20 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-2.5 py-0.5 text-[11px] font-bold text-white uppercase tracking-wider">
                      Immediate Critical Response
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      24/7 Trauma, ICU & Ambulance
                    </h3>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 dark:bg-rose-950">
                    <Ambulance className="h-6 w-6 animate-pulse" />
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Our emergency wing is staffed 24 hours with certified critical-care resuscitation consultants, rapid-response catheterization teams, and mobile ICU ambulances.
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
                    href="tel:+8801567898506"
                    className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-3 text-slate-800 hover:bg-slate-50 transition-colors text-center dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    <span className="text-[11px] font-medium text-slate-400">Doctor Helpline</span>
                    <span className="text-sm font-bold">01567-898506</span>
                  </a>
                </div>
              </div>

              {/* Fast Service Cards */}
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/doctors"
                  className="rounded-xl border border-slate-200/80 bg-white p-4 hover:border-teal-500/50 hover:shadow-md transition-all group dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="h-9 w-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-2 group-hover:bg-teal-600 group-hover:text-white transition-colors dark:bg-teal-950 dark:text-teal-400">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Doctor Chamber</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Explore visiting hours & room</p>
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
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: CLINICAL IMPACT & QUALITY METRICS BAR                           */}
      {/* ========================================================================= */}
      <section className="border-y border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 py-10">
        <div className="w-full max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800">
            {HOSPITAL_STATS.map((stat, idx) => (
              <div key={idx} className={cn("text-center space-y-1", idx > 0 ? "pt-4 sm:pt-0" : "")}>
                <p className="text-3xl sm:text-4xl md:text-5xl font-black text-teal-600 dark:text-teal-400 tracking-tight">
                  {stat.value}
                </p>
                <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                  {stat.label}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {stat.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: SPECIALIZED CENTERS OF EXCELLENCE (DEPARTMENTS GRID)           */}
      {/* ========================================================================= */}
      <section id="departments" className="py-16 md:py-24 bg-slate-50 dark:bg-slate-950">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {CLINICAL_DEPARTMENTS.map((dept, index) => {
              const Icon = dept.icon;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-teal-500 hover:shadow-xl transition-all duration-300 group dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between"
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

                    <div className="rounded-lg bg-teal-50/60 p-2.5 text-[11px] font-medium text-teal-800 dark:bg-teal-950/50 dark:text-teal-300 border border-teal-100 dark:border-teal-900/40">
                      ⚡ {dept.highlight}
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {dept.doctorsCount} Specialists Active
                    </span>

                    <Link
                      href={`/doctors?dept=${encodeURIComponent(dept.query)}`}
                      className="inline-flex items-center text-xs font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400 group-hover:translate-x-1 transition-all"
                    >
                      Book Serial
                      <ChevronRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: 24/7 EMERGENCY & LEVEL-1 TRAUMA RESPONSE UNIT                   */}
      {/* ========================================================================= */}
      <section id="emergency-unit" className="py-16 md:py-20 bg-gradient-to-r from-rose-800 via-rose-700 to-red-900 text-white relative overflow-hidden">
        <div className="w-full max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-rose-100 border border-white/20">
                <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                Round-the-Clock Critical Care & Trauma Command
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Immediate Critical Resuscitation, When Every Second Counts.
              </h2>

              <p className="text-sm sm:text-base text-rose-100 max-w-3xl leading-relaxed">
                MediCore Hospital operates a dedicated Level-1 Acute Trauma Center with specialized triage bays, rapid stroke thrombolysis teams, round-the-clock primary angioplasty, and an advanced mobile ICU ambulance fleet equipped with cardiac ventilators.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="rounded-xl bg-white/10 p-3.5 border border-white/10">
                  <p className="text-2xl font-black">&lt; 45 Mins</p>
                  <p className="text-xs text-rose-200 font-medium">Door-to-Balloon Primary Angioplasty</p>
                </div>
                <div className="rounded-xl bg-white/10 p-3.5 border border-white/10">
                  <p className="text-2xl font-black">24/7 CT & MRI</p>
                  <p className="text-xs text-rose-200 font-medium">Rapid Acute Stroke Brain Imaging</p>
                </div>
                <div className="rounded-xl bg-white/10 p-3.5 border border-white/10">
                  <p className="text-2xl font-black">50 ICUs</p>
                  <p className="text-xs text-rose-200 font-medium">Equipped with Smart Invasive Ventilators</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <div className="rounded-2xl bg-white p-6 text-slate-900 shadow-2xl space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Direct Dispatch Helpline</span>
                  <p className="text-2xl font-black text-slate-900">Call Ambulance: 10666</p>
                  <p className="text-xs text-slate-500">Available from any landline or mobile network across Bangladesh.</p>
                </div>

                <a
                  href="tel:10666"
                  className="flex items-center justify-center gap-2 rounded-xl bg-rose-600 py-3.5 text-base font-black text-white hover:bg-rose-700 transition-colors shadow-lg shadow-rose-600/30"
                >
                  <Phone className="h-5 w-5" />
                  Call Emergency 10666
                </a>

                <a
                  href="tel:+8801567898506"
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  General Hospital Helpline: +880 1567-898506
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7: PREVENTIVE HEALTH CHECKUP PACKAGES                             */}
      {/* ========================================================================= */}
      <section id="health-packages" className="py-16 md:py-24 bg-white dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800">
        <div className="w-full max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Wellness & Proactive Diagnostics
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Preventive Health Checkup Packages
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Early diagnosis saves lives. Our comprehensive health screening packages are designed to identify risk factors before symptoms arise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {HEALTH_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 flex flex-col justify-between hover:bg-white hover:border-teal-500 hover:shadow-xl transition-all dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-teal-100 px-3 py-0.5 text-[11px] font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                      {pkg.tag}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {pkg.testsCount} Tests
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {pkg.description}
                    </p>
                  </div>

                  <div className="pt-2">
                    <span className="text-xs text-slate-400 font-semibold uppercase">Package Price</span>
                    <p className="text-2xl font-black text-slate-900 dark:text-slate-100">
                      ৳{pkg.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-2 border-t border-slate-200/80 dark:border-slate-800 pt-4 text-xs text-slate-600 dark:text-slate-300">
                    <p className="font-bold text-slate-900 dark:text-slate-200 text-[11px] uppercase tracking-wider">Key Investigations:</p>
                    {pkg.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-200/80 dark:border-slate-800">
                  <Link
                    href="/doctors"
                    className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-teal-600/25 transition-all duration-200 hover:from-teal-700 hover:to-emerald-700 hover:shadow-lg hover:shadow-teal-600/35 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span>Book Health Package</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 8: CUTTING-EDGE MEDICAL TECHNOLOGY & HOSPITAL INFRASTRUCTURE      */}
      {/* ========================================================================= */}
      <section id="technology" className="py-16 md:py-24 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800">
        <div className="w-full max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Pioneering Clinical Infrastructure
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Advanced Medical Technology & Robotics
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Precision matters in clinical outcomes. MediCore invests in the highest tier of diagnostic radiological and surgical innovations available worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOSPITAL_TECHNOLOGIES.map((tech, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg transition-all dark:border-slate-800 dark:bg-slate-900 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                      {tech.category}
                    </span>
                    <Badge variant="outline" className="text-[10px] border-slate-200 dark:border-slate-700">
                      {tech.badge}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {tech.name}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {tech.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Certified High Precision</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 9: FEATURED SENIOR SPECIALIST PHYSICIANS                          */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 bg-white dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800">
        <div className="w-full max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                Senior Medical Board
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Featured Specialist Physicians
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                Consult with renowned professors, surgeons, and physicians with international fellowships and decades of clinical expertise.
              </p>
            </div>

            <Link
              href="/doctors"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "border-slate-300 text-teal-700 hover:bg-teal-50 self-start md:self-auto font-semibold dark:border-slate-700 dark:text-teal-300"
              )}
            >
              Browse Full Roster
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_DOCTORS.map((doc, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 flex flex-col justify-between hover:bg-white hover:border-teal-500 hover:shadow-xl transition-all dark:border-slate-800 dark:bg-slate-900 space-y-4"
              >
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                      {doc.name}
                    </h3>
                    <p className="text-xs font-semibold text-teal-700 dark:text-teal-400">
                      {doc.dept}
                    </p>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200/80 dark:border-slate-800 pt-2 font-medium">
                    {doc.qual}
                  </p>

                  <div className="rounded-xl bg-white p-3 text-xs space-y-1.5 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
                    <div className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                      <MapPin className="h-3.5 w-3.5 text-teal-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{doc.chamber}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <Clock className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                      <span>{doc.time}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Visiting Fee</span>
                    <p className="text-base font-black text-slate-900 dark:text-white">
                      ৳{doc.fee.toLocaleString()}
                    </p>
                  </div>

                  <Link
                    href={`/doctors?search=${encodeURIComponent(doc.name)}`}
                    className="inline-flex items-center justify-center rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2 shadow-sm hover:shadow-md transition-all active:scale-95"
                  >
                    Book Serial
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 10: STEP-BY-STEP PATIENT CARE JOURNEY                             */}
      {/* ========================================================================= */}
      <section id="patient-care" className="py-16 md:py-24 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800">
        <div className="w-full max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Seamless Healthcare Experience
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Your 4-Step Patient Care Journey
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              From choosing your specialist to obtaining your digital prescription and test results—MediCore makes hospitalization and doctor visits hassle-free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Select Specialist Physician",
                desc: "Filter by department, medical condition, or doctor qualifications in our public registry.",
                icon: Stethoscope,
              },
              {
                step: "02",
                title: "Choose Date & Time Slot",
                desc: "Check available visiting days and select a convenient consultation chamber slot.",
                icon: Calendar,
              },
              {
                step: "03",
                title: "Instant Serial Confirmation",
                desc: "Receive real-time token number, room details, and SMS confirmation without waiting in lines.",
                icon: FileCheck,
              },
              {
                step: "04",
                title: "Digital Records & Follow-up",
                desc: "Access your e-prescriptions, lab test PDF reports, and billing receipts from any device.",
                icon: HeartPulse,
              },
            ].map((st, i) => {
              const Icon = st.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900 space-y-4 relative overflow-hidden"
                >
                  <span className="text-5xl font-black text-slate-100 dark:text-slate-800 absolute right-4 top-4 select-none">
                    {st.step}
                  </span>
                  <div className="h-12 w-12 rounded-xl bg-teal-600/10 text-teal-600 flex items-center justify-center dark:bg-teal-500/10 dark:text-teal-400 relative z-10">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-1 relative z-10">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {st.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 11: INTERNATIONAL & OUTSTATION PATIENT CARE CENTER               */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-20 bg-teal-900 text-white relative overflow-hidden">
        <div className="w-full max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-teal-800/80 px-3.5 py-1 text-xs font-semibold text-teal-200 border border-teal-700">
                <Globe className="h-3.5 w-3.5" />
                <span>Dedicated Outstation & International Patient Helpdesk</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Traveling to Dhaka for Medical Treatment?
              </h2>
              <p className="text-sm sm:text-base text-teal-100 max-w-2xl leading-relaxed">
                Our International Patient Services team provides complete end-to-end assistance: tele-consultation before travel, airport ambulance reception, dedicated guest liaison officers, multi-language support, and discounted accommodation arrangements.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <div className="rounded-2xl bg-teal-800/60 p-6 border border-teal-700/60 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-teal-300">International Coordinator</p>
                <p className="text-xl font-bold">+880 1711-000000</p>
                <p className="text-xs text-teal-200">Email: international@medicore-hospitals.com</p>
                <div className="pt-2">
                  <Link
                    href="/doctors"
                    className={cn(
                      buttonVariants({ size: "sm" }),
                      "w-full bg-white hover:bg-teal-50 text-teal-900 font-bold"
                    )}
                  >
                    Request Medical Travel Assistance
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 12: VERIFIED PATIENT RECOVERY STORIES & TESTIMONIALS              */}
      {/* ========================================================================= */}
      <section id="testimonials" className="py-16 md:py-24 bg-white dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800">
        <div className="w-full max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
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
                    {review.relation} • <span className="text-teal-600 dark:text-teal-400 font-medium">{review.dept}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 13: HOSPITAL NEWS, HEALTH ARTICLES & MEDICAL NOTICES              */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800">
        <div className="w-full max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                Hospital Bulletins & Health Updates
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Latest Clinical Updates & News
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                Stay updated with breakthroughs in our treatment programs, medical equipment additions, and hospital community camps.
              </p>
            </div>

            <Link
              href="/doctors"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "border-slate-300 font-semibold self-start md:self-auto text-xs"
              )}
            >
              View All Notices
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOSPITAL_NEWS.map((news, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="rounded-md bg-teal-50 px-2 py-0.5 font-bold text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                      {news.category}
                    </span>
                    <span className="text-slate-400">{news.date}</span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                    {news.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {news.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-teal-600 hover:text-teal-700 inline-flex items-center gap-1">
                    Read Clinical Bulletin <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 14: FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION)                     */}
      {/* ========================================================================= */}
      <section id="faq" className="py-16 md:py-24 bg-white dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800">
        <div className="w-full max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Clear Answers for Patients & Families
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Got queries regarding appointments, insurance, ambulance, or online reports? Here are answers to common questions.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-3">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 overflow-hidden transition-all dark:border-slate-800 dark:bg-slate-900"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-teal-600 transition-colors"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-slate-400 transition-transform duration-200 shrink-0 ml-4",
                        isOpen ? "rotate-180 text-teal-600" : ""
                      )}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200/60 dark:border-slate-800">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 15: HOSPITAL CAMPUS, 24/7 CONTACT & COMPREHENSIVE FOOTER          */}
      {/* ========================================================================= */}
      <footer className="border-t border-slate-200 bg-slate-900 text-slate-300 pt-16 pb-12 dark:border-slate-800 dark:bg-slate-950">
        <div className="w-full max-w-[1640px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 space-y-12">
          {/* Top Campus Address Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b border-slate-800">
            <div className="rounded-2xl bg-slate-800/80 p-6 border border-slate-700/60 space-y-2">
              <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
                <Building2 className="h-4 w-4" />
                <span>Dhaka Main Hospital Campus (Tertiary Center)</span>
              </div>
              <p className="text-xs text-slate-300">
                Plot 81, Block E, Bashundhara R/A, Dhaka-1229, Bangladesh
              </p>
              <p className="text-xs text-slate-400">
                Emergency 24/7: <a href="tel:10666" className="text-white font-bold hover:underline">10666</a> | Helpline: +880 1567-898506
              </p>
            </div>

            <div className="rounded-2xl bg-slate-800/80 p-6 border border-slate-700/60 space-y-2">
              <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
                <Building2 className="h-4 w-4" />
                <span>Chattogram Diagnostic & Day-Care Center</span>
              </div>
              <p className="text-xs text-slate-300">
                Holding 44, GEC Circle, Nasirabad, Chattogram-4000
              </p>
              <p className="text-xs text-slate-400">
                Direct Appointment: +880 1567-898506
              </p>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Col 1 */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <MediCoreLogoIcon size={42} className="shrink-0" />
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
                  <span>Emergency: 10666 | General Helpline: +880 1567-898506</span>
                </div>
              </div>
            </div>

            {/* Col 2 */}
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

            {/* Col 3 */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Patient Care</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><Link href="/doctors" className="hover:text-teal-300">Book Doctor Serial</Link></li>
                <li><Link href="/login" className="hover:text-teal-300">Patient Portal Sign In</Link></li>
                <li><Link href="/register" className="hover:text-teal-300">Online Patient Registration</Link></li>
                <li><a href="#health-packages" className="hover:text-teal-300">Health Checkup Packages</a></li>
                <li><a href="#emergency-unit" className="hover:text-teal-300">24/7 Ambulance Service</a></li>
                <li><span className="text-slate-500">Hospital Visitor Guidelines</span></li>
              </ul>
            </div>

            {/* Col 4 */}
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
