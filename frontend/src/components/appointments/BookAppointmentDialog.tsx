"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Printer,
  X,
  Loader2,
  Stethoscope,
  Phone,
  User,
  AlertCircle,
  FileText,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { appointmentService } from "@/services/api";
import { useAuthStore } from "@/store";
import type { Doctor, Appointment, PatientGender } from "@/types";

interface BookAppointmentDialogProps {
  doctor: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (appointment: Appointment) => void;
}

export function BookAppointmentDialog({
  doctor,
  isOpen,
  onClose,
  onSuccess,
}: BookAppointmentDialogProps) {
  const user = useAuthStore((state) => state.user);

  // Form states
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientAge, setPatientAge] = useState<number | "">(32);
  const [patientGender, setPatientGender] = useState<PatientGender>("MALE");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [problemDescription, setProblemDescription] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Auto-fill user information if logged in
  useEffect(() => {
    if (user) {
      if (user.name) setPatientName(user.name);
      if (user.phone) setPatientPhone(user.phone);
      if (user.email) setPatientEmail(user.email);
    }
  }, [user]);

  // Set default appointment date to tomorrow in YYYY-MM-DD
  useEffect(() => {
    if (isOpen && doctor) {
      setConfirmedAppointment(null);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateString = tomorrow.toISOString().split("T")[0];
      setAppointmentDate(dateString);
      setAppointmentTime(doctor.availableTime.start || "05:00 PM");
    }
  }, [isOpen, doctor]);

  if (!isOpen || !doctor) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to your patient account first to book an appointment");
      return;
    }

    if (!patientName.trim()) {
      toast.error("Please enter the patient full name");
      return;
    }
    if (!patientPhone.trim()) {
      toast.error("Please enter a valid contact phone number");
      return;
    }
    if (!patientAge || Number(patientAge) <= 0) {
      toast.error("Please enter a valid age");
      return;
    }
    if (!appointmentDate) {
      toast.error("Please select an appointment date");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await appointmentService.bookSerial({
        doctorId: doctor.id,
        patientName: patientName.trim(),
        patientPhone: patientPhone.trim(),
        patientEmail: patientEmail.trim() || undefined,
        patientAge: Number(patientAge),
        patientGender,
        appointmentDate,
        appointmentTime: appointmentTime || doctor.availableTime.start,
        problemDescription: problemDescription.trim() || undefined,
      });

      if (response.success && response.data) {
        const booked = response.data.appointment;
        setConfirmedAppointment(booked);
        toast.success("Serial Token Generated Successfully!", {
          description: `Token: ${booked.serialNumber} for ${doctor.name}`,
        });
        if (onSuccess) onSuccess(booked);
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || "Failed to book appointment serial";
      toast.error("Booking Failed", { description: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-2 sm:p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 my-auto overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-3.5 top-3.5 sm:right-4 sm:top-4 z-20 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* ========================================================================= */}
        {/* VIEW 0: LOGIN REQUIRED GATE                                               */}
        {/* ========================================================================= */}
        {!user ? (
          <div className="overflow-y-auto p-6 sm:p-8 space-y-5 flex-1 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 border border-teal-200 dark:bg-teal-950/60 dark:text-teal-400 dark:border-teal-800 shadow-md">
              <Lock className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900">
                <ShieldCheck className="h-3.5 w-3.5" />
                Patient Login Required
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Log In to Book Serial
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                To schedule a consultation and generate an official serial token with <strong className="text-slate-800 dark:text-slate-200">{doctor.name}</strong> ({doctor.department}), please log in to your patient account first.
              </p>
            </div>

            {/* Doctor summary card */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left dark:border-slate-800 dark:bg-slate-900/60 flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{doctor.name}</p>
                <p className="text-xs text-slate-500">{doctor.specialization} • {doctor.roomNumber}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Consultation Fee</span>
                <span className="font-black text-sm text-teal-700 dark:text-teal-400">৳{doctor.consultationFee.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2">
              <Link
                href="/login?redirect=/doctors"
                className={cn(
                  buttonVariants({ size: "default" }),
                  "flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs h-11 rounded-xl shadow-md shadow-teal-600/25 cursor-pointer text-center"
                )}
              >
                Log In to Patient Account
              </Link>
              <Link
                href="/register?redirect=/doctors"
                className={cn(
                  buttonVariants({ variant: "outline", size: "default" }),
                  "flex-1 border-slate-300 font-bold text-xs h-11 rounded-xl cursor-pointer text-center"
                )}
              >
                Create New Patient Account
              </Link>
            </div>
          </div>
        ) : confirmedAppointment ? (
          <div className="overflow-y-auto p-4 sm:p-8 space-y-4 sm:space-y-6 flex-1">
            <div className="text-center space-y-2">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Serial Token Confirmed!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Your consultation appointment has been scheduled at MediCore Hospitals.
              </p>
            </div>

            {/* Printable Digital Token Card */}
            <div className="rounded-2xl border-2 border-dashed border-teal-500/40 bg-teal-50/40 dark:bg-teal-950/20 p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-teal-200/60 dark:border-teal-900/60 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                    Serial Token Number
                  </span>
                  <p className="text-2xl font-black text-slate-900 dark:text-white tracking-wide">
                    {confirmedAppointment.serialNumber}
                  </p>
                </div>
                <Badge className="bg-emerald-600 text-white font-bold text-xs">
                  CONFIRMED
                </Badge>
              </div>

              {/* Consultation Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Physician:</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{confirmedAppointment.doctorName}</p>
                  <p className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">{confirmedAppointment.doctorDepartment}</p>
                </div>

                <div>
                  <span className="text-slate-400 font-medium">Patient:</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{confirmedAppointment.patientName}</p>
                  <p className="text-[11px] text-slate-500">{confirmedAppointment.patientGender}, {confirmedAppointment.patientAge} Yrs</p>
                </div>

                <div>
                  <span className="text-slate-400 font-medium">Consultation Date:</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{confirmedAppointment.appointmentDate}</p>
                  <p className="text-[11px] text-slate-500">{confirmedAppointment.appointmentTime}</p>
                </div>

                <div>
                  <span className="text-slate-400 font-medium">Visiting Chamber:</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{confirmedAppointment.roomNumber}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-teal-200/60 dark:border-teal-900/60 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400">Consultation Fee:</span>
                  <p className="text-base font-black text-slate-900 dark:text-slate-100">
                    ৳{confirmedAppointment.consultationFee.toLocaleString()}
                  </p>
                </div>
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900">
                  Pay at Chamber Desk
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 text-center leading-relaxed">
              💡 Please arrive at Chamber Room {confirmedAppointment.roomNumber} 15 minutes prior to your scheduled consultation time.
            </p>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrint}
                className="flex-1 gap-2 font-bold text-xs h-11 cursor-pointer"
              >
                <Printer className="h-4 w-4" />
                Print / Save Slip
              </Button>
              <Button
                type="button"
                onClick={onClose}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs h-11 cursor-pointer"
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* VIEW 2: BOOKING FORM                                                      */
          /* ========================================================================= */
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            {/* Header with Doctor Summary */}
            <div className="px-4 sm:px-7 py-3.5 sm:py-4 border-b border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50/70 dark:bg-slate-900/70 pr-12 space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-bold text-teal-700 border border-teal-200 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800">
                  {doctor.department}
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  Fee: ৳{doctor.consultationFee.toLocaleString()}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white truncate">
                Book Serial: {doctor.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {doctor.specialization} • {doctor.roomNumber}
              </p>
            </div>

            <div className="overflow-y-auto p-4 sm:p-7 space-y-4 sm:space-y-5 flex-1">
              {/* Doctor Visiting Schedule Helper Pill */}
              <div className="rounded-xl bg-slate-50 p-3 text-xs space-y-1.5 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                  <Calendar className="h-3.5 w-3.5 text-teal-600" />
                  <span>Available Visiting Days:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {doctor.availableDays.map((d) => (
                    <span
                      key={d}
                      className="rounded bg-white px-2 py-0.5 text-[10px] font-bold text-teal-700 border border-slate-200 dark:bg-slate-900 dark:text-teal-400 dark:border-slate-800"
                    >
                      {d}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 pt-0.5">
                  Chamber Visiting Hours: {doctor.availableTime.start} – {doctor.availableTime.end}
                </p>
              </div>

              {/* Date & Time Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="appointmentDate" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Consultation Date *
                  </Label>
                  <Input
                    id="appointmentDate"
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="h-10 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="appointmentTime" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Preferred Time Slot *
                  </Label>
                  <Input
                    id="appointmentTime"
                    type="text"
                    required
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    placeholder="e.g. 05:30 PM"
                    className="h-10 text-xs"
                  />
                </div>
              </div>

              {/* Patient Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="patientName" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Patient Full Name *
                  </Label>
                  <Input
                    id="patientName"
                    type="text"
                    required
                    placeholder="Full Name (e.g. Karim Ahmed)"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="h-10 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="patientPhone" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Contact Phone Number *
                  </Label>
                  <Input
                    id="patientPhone"
                    type="tel"
                    required
                    placeholder="e.g. 01567-898506"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="h-10 text-xs"
                  />
                </div>
              </div>

              {/* Age, Gender & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="patientAge" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Age (Yrs) *
                  </Label>
                  <Input
                    id="patientAge"
                    type="number"
                    required
                    min={0}
                    max={120}
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value === "" ? "" : Number(e.target.value))}
                    className="h-10 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="patientGender" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Gender *
                  </Label>
                  <select
                    id="patientGender"
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value as PatientGender)}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="patientEmail" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Email (Optional)
                  </Label>
                  <Input
                    id="patientEmail"
                    type="email"
                    placeholder="name@email.com"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="h-10 text-xs"
                  />
                </div>
              </div>

              {/* Health Issue / Reason */}
              <div className="space-y-1.5">
                <Label htmlFor="problemDescription" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Symptoms / Problem Reason (Optional)
                </Label>
                <Input
                  id="problemDescription"
                  type="text"
                  placeholder="e.g. Chest pain since yesterday, Routine heart checkup"
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  className="h-10 text-xs"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="shrink-0 p-3.5 sm:px-7 sm:py-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="h-11 px-5 rounded-xl text-xs font-bold w-full sm:w-auto cursor-pointer"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/25 transition-all hover:scale-[1.02] w-full sm:w-auto cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Token...
                  </>
                ) : (
                  <>Confirm & Generate Serial (৳{doctor.consultationFee.toLocaleString()})</>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
