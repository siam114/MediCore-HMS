"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { doctorService } from "@/services/api";
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
];

export default function DoctorsDirectoryPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDept, setSelectedDept] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isSubscribed = true;
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
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 text-white shadow-md shadow-teal-600/30">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-slate-100">MediCore HMS</span>
              <span className="ml-2 text-xs text-slate-400">Doctor Directory</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Portal Sign In
            </Link>
            <Link
              href="/register"
              className={cn(
                buttonVariants({ size: "sm" }),
                "bg-teal-600 hover:bg-teal-700 text-white"
              )}
            >
              Patient Register
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 sm:px-6 max-w-6xl space-y-8">
        {/* Banner */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-700 dark:text-teal-300 border border-teal-500/20">
            <Stethoscope className="h-3.5 w-3.5" />
            Specialist Consultants & Physicians
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            Find the Right Doctor for Your Care
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Browse our experienced team of specialist physicians, check consultation hours, and book your appointment.
          </p>
        </div>

        {/* Search & Department Filters */}
        <div className="space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by doctor name or specialty..."
              className="pl-10 h-11 bg-white shadow-sm dark:bg-slate-900"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Department Pills */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 text-xs">
            <Filter className="h-3.5 w-3.5 text-slate-400 mr-1 hidden sm:inline-block" />
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`rounded-full px-3.5 py-1.5 font-medium transition-all ${
                  selectedDept === dept
                    ? "bg-teal-600 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Doctor Cards Grid */}
        {isLoading ? (
          <div className="text-center py-16 space-y-3">
            <Activity className="h-8 w-8 animate-spin text-teal-600 mx-auto" />
            <p className="text-sm text-slate-500">Loading specialist doctors...</p>
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 p-8 space-y-3">
            <Stethoscope className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">No Doctors Found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              No doctor profiles matched your current search criteria. Try selecting &quot;All&quot; departments.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <Card
                key={doctor.id}
                className="overflow-hidden border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-shadow dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between"
              >
                <CardContent className="p-6 space-y-4">
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                          {doctor.name}
                        </h3>
                      </div>
                      <p className="text-xs font-medium text-teal-700 dark:text-teal-400">
                        {doctor.specialization}
                      </p>
                    </div>
                    <Badge variant="doctor">{doctor.department}</Badge>
                  </div>

                  {/* Qualifications & Experience */}
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
                    <div className="flex items-center gap-2">
                      <Award className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{doctor.qualification}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{doctor.experienceYears} Years Clinical Experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{doctor.roomNumber}</span>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="rounded-lg bg-slate-50 p-3 text-xs space-y-1.5 dark:bg-slate-800/50">
                    <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                      <Calendar className="h-3.5 w-3.5 text-teal-600" />
                      <span>Visiting Days:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {doctor.availableDays.map((day) => (
                        <span
                          key={day}
                          className="rounded bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800"
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 pt-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>
                        {doctor.availableTime.start} - {doctor.availableTime.end}
                      </span>
                    </div>
                  </div>

                  {/* Fee & Action */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-[11px] text-slate-400 uppercase font-semibold">Consultation Fee</span>
                      <p className="text-base font-bold text-slate-900 dark:text-slate-100">
                        ৳{doctor.consultationFee.toLocaleString()}
                      </p>
                    </div>

                    <Link
                      href="/login"
                      className={cn(
                        buttonVariants({ size: "sm" }),
                        "bg-teal-600 hover:bg-teal-700 text-white"
                      )}
                    >
                      Book Appointment
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
