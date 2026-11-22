"use client";

import {
  Printer,
  X,
  Activity,
  HeartPulse,
  Thermometer,
  Scale,
  Calendar,
  CheckCircle2,
  Phone,
  Building2,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Prescription } from "@/types";

interface ViewPrescriptionDialogProps {
  prescription: Prescription | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewPrescriptionDialog({
  prescription,
  isOpen,
  onClose,
}: ViewPrescriptionDialogProps) {
  if (!isOpen || !prescription) return null;

  const handlePrint = () => {
    window.print();
  };

  const createdDate = new Date(prescription.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl my-6 rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Top Action Bar (hidden on print) */}
        <div className="print:hidden flex items-center justify-between border-b border-slate-100 bg-slate-50/90 px-6 py-3.5 dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
              <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />
              Official Prescription: {prescription.prescriptionNumber}
            </span>
            {prescription.serialNumber && (
              <span className="text-xs text-slate-500 font-medium">
                (Token #{prescription.serialNumber})
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handlePrint}
              className="bg-teal-600 hover:bg-teal-700 text-white gap-1.5 shadow-sm"
            >
              <Printer className="h-4 w-4" />
              Print / Save PDF
            </Button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Prescription Paper Pad */}
        <div id="prescription-pad" className="overflow-y-auto p-6 sm:p-10 space-y-6 bg-white text-slate-900 print:p-0 print:m-0 print:overflow-visible">
          {/* Hospital Letterhead Header */}
          <div className="border-b-2 border-teal-700 pb-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-700 text-white shadow-md">
                  <Activity className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-slate-900 font-serif">
                    MediCore Hospitals
                  </h1>
                  <p className="text-xs font-semibold text-teal-800 uppercase tracking-wider">
                    Tertiary Care & Specialist Research Center
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Plot 14, Block C, Gulshan-2, Dhaka-1212 • Hotline: 10666 • www.medicore.com
                  </p>
                </div>
              </div>

              {/* Rx Ref & Date */}
              <div className="text-left sm:text-right space-y-1">
                <div className="inline-block rounded-md bg-teal-50 border border-teal-200 px-3 py-1 font-mono text-xs font-bold text-teal-800">
                  {prescription.prescriptionNumber}
                </div>
                <p className="text-xs text-slate-500">
                  Date: <span className="font-semibold text-slate-800">{createdDate}</span>
                </p>
                {prescription.serialNumber && (
                  <p className="text-xs text-slate-500">
                    Serial: <span className="font-bold text-teal-700">#{prescription.serialNumber}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Doctor Info Subheader */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs">
              <div>
                <p className="text-base font-bold text-teal-900 font-serif">
                  {prescription.doctorName}
                </p>
                <p className="text-slate-600 font-medium">
                  {prescription.doctorQualification}
                </p>
              </div>
              <div className="text-left sm:text-right mt-1 sm:mt-0">
                <p className="font-semibold text-teal-800">{prescription.doctorDepartment}</p>
                <p className="text-slate-500">{prescription.doctorRoom}</p>
              </div>
            </div>
          </div>

          {/* Patient Details Ribbon */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-slate-500">Patient Name: </span>
                <span className="font-bold text-slate-900">{prescription.patientName}</span>
              </div>
              <div>
                <span className="text-slate-500">Age / Gender: </span>
                <span className="font-semibold text-slate-800">
                  {prescription.patientAge} Years / {prescription.patientGender}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Phone: </span>
                <span className="font-mono text-slate-800">{prescription.patientPhone}</span>
              </div>
              <div>
                <span className="text-slate-500">Prescription Date: </span>
                <span className="font-medium text-slate-800">{createdDate}</span>
              </div>
            </div>
          </div>

          {/* Main Clinical Body: Two Columns */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[420px]">
            {/* Left Column: Vitals, Diagnosis, Tests (35%) */}
            <div className="md:col-span-4 border-r-0 md:border-r border-slate-200 pr-0 md:pr-5 space-y-5 text-xs">
              {/* Clinical Vitals */}
              {prescription.vitals && (
                <div className="space-y-2 rounded-lg bg-slate-50 p-3 border border-slate-100">
                  <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-700">
                    Clinical Vitals
                  </h4>
                  <div className="space-y-1.5 text-slate-700">
                    {prescription.vitals.bloodPressure && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Blood Pressure:</span>
                        <span className="font-semibold">{prescription.vitals.bloodPressure}</span>
                      </div>
                    )}
                    {prescription.vitals.pulseRate && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Pulse:</span>
                        <span className="font-semibold">{prescription.vitals.pulseRate}</span>
                      </div>
                    )}
                    {prescription.vitals.temperature && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Temperature:</span>
                        <span className="font-semibold">{prescription.vitals.temperature}</span>
                      </div>
                    )}
                    {prescription.vitals.weight && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Weight:</span>
                        <span className="font-semibold">{prescription.vitals.weight}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Diagnosis */}
              <div className="space-y-1">
                <h4 className="font-bold text-[11px] uppercase tracking-wider text-teal-800">
                  Diagnosis
                </h4>
                <p className="font-semibold text-slate-900 bg-teal-50/50 p-2 rounded border border-teal-100">
                  {prescription.diagnosis}
                </p>
              </div>

              {/* Symptoms */}
              {prescription.symptoms && prescription.symptoms.length > 0 && (
                <div className="space-y-1">
                  <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-600">
                    Symptoms
                  </h4>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                    {prescription.symptoms.map((sym, idx) => (
                      <li key={idx}>{sym}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommended Investigations */}
              {prescription.investigations && prescription.investigations.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <h4 className="font-bold text-[11px] uppercase tracking-wider text-teal-800 flex items-center gap-1">
                    <Activity className="h-3.5 w-3.5 text-teal-600" />
                    Recommended Investigations
                  </h4>
                  <div className="rounded-lg bg-amber-50/60 p-2.5 border border-amber-200/60 space-y-1">
                    {prescription.investigations.map((test, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-slate-800">
                        <span className="font-bold text-amber-700">{idx + 1}.</span>
                        <span>{test}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Rx Medications & Advice (65%) */}
            <div className="md:col-span-8 pl-0 md:pl-2 space-y-6">
              {/* Rx Symbol & Medication List */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-black text-3xl text-teal-700">℞</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Prescribed Medication Schedule
                  </span>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  {prescription.medicines.map((med, index) => (
                    <div
                      key={index}
                      className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="h-5 w-5 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">
                            {index + 1}
                          </span>
                          <span className="font-bold text-slate-900 text-sm">{med.name}</span>
                        </div>
                        <p className="text-xs text-slate-500 pl-7">{med.instruction}</p>
                      </div>

                      <div className="flex items-center gap-3 pl-7 sm:pl-0 text-xs">
                        <span className="rounded-md bg-teal-50 px-2.5 py-1 font-bold text-teal-800 border border-teal-200">
                          {med.dosage}
                        </span>
                        <span className="text-slate-600 font-medium whitespace-nowrap">
                          {med.duration}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Advice */}
              {prescription.advice && (
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-1.5 text-xs">
                  <h4 className="font-bold uppercase tracking-wider text-slate-700">
                    Advice & Patient Directions:
                  </h4>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                    {prescription.advice}
                  </p>
                </div>
              )}

              {/* Follow-up Note */}
              {prescription.followUpDate && (
                <div className="flex items-center gap-2 text-xs text-slate-700 bg-emerald-50/80 p-3 rounded-lg border border-emerald-200">
                  <Calendar className="h-4 w-4 text-emerald-600" />
                  <span>
                    <strong className="text-emerald-900">Follow-up: </strong>
                    {prescription.followUpDate}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Footer Signature & Seal */}
          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-end justify-between gap-6 text-xs text-slate-500">
            <div className="space-y-1">
              <p className="font-medium text-slate-700">
                MediCore Hospitals Digital Health Network
              </p>
              <p className="text-[11px]">
                Valid e-prescription verified by hospital medical administration.
              </p>
            </div>

            <div className="text-center sm:text-right">
              <div className="w-48 border-b border-dashed border-slate-400 pb-1 mb-1 font-serif italic text-teal-800 font-semibold text-sm">
                {prescription.doctorName}
              </div>
              <p className="text-[11px] font-bold text-slate-600">Registered Medical Practitioner</p>
              <p className="text-[10px] text-slate-400">Digital Seal & Verification</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
