"use client";

import { useState } from "react";
import {
  Printer,
  Download,
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
  Loader2,
  FileText,
  FileCheck2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen || !prescription) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    try {
      setIsDownloading(true);
      const element = document.getElementById("prescription-pad");
      if (!element) {
        toast.error("Prescription content not found");
        return;
      }

      toast.info("Generating official PDF document...");

      // Render high resolution canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: 1024,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Prescription_${prescription.prescriptionNumber}.pdf`);

      toast.success("Prescription PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("PDF download failed, opening print preview instead...");
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  const createdDate = new Date(prescription.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 sm:p-4 md:p-6 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl my-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Action Bar (hidden on print) */}
        <div className="print:hidden sticky top-0 z-20 flex flex-wrap items-center justify-between border-b border-slate-200 bg-slate-50/95 px-4 sm:px-6 py-3 dark:border-slate-800 dark:bg-slate-900/95 backdrop-blur-sm gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
              <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />
              Prescription: {prescription.prescriptionNumber}
            </span>
            {prescription.serialNumber && (
              <span className="hidden sm:inline text-xs text-slate-500 font-medium">
                (Token #{prescription.serialNumber})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Download PDF Button */}
            <Button
              size="sm"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="bg-teal-600 hover:bg-teal-700 text-white gap-1.5 text-xs font-semibold shadow-sm cursor-pointer"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5" />
                  Download PDF
                </>
              )}
            </Button>

            {/* Print Button */}
            <Button
              size="sm"
              variant="outline"
              onClick={handlePrint}
              className="text-slate-700 border-slate-300 hover:bg-slate-100 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800 gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              Print
            </Button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors ml-1 cursor-pointer"
              title="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Prescription Paper Pad Container */}
        <div
          id="prescription-pad"
          className="overflow-y-auto p-4 sm:p-8 md:p-10 space-y-6 bg-white text-slate-900 print:p-0 print:m-0 print:overflow-visible print:max-w-none print:shadow-none"
        >
          {/* Top Brand Stripe */}
          <div className="h-2 w-full rounded-full bg-gradient-to-r from-teal-800 via-teal-600 to-emerald-600 mb-3" />

          {/* Hospital Letterhead Header */}
          <div className="border-b-2 border-teal-800/80 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-700 text-white shadow-md">
                  <Activity className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-slate-900 font-serif">
                    MediCore Hospitals
                  </h1>
                  <p className="text-xs font-bold text-teal-800 uppercase tracking-wider">
                    Tertiary Care & Specialist Research Center
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Plot 14, Block C, Gulshan-2, Dhaka-1212 • Hotline: 10666 • www.medicore.com
                  </p>
                </div>
              </div>

              {/* Rx Ref & Date */}
              <div className="text-left sm:text-right space-y-1 shrink-0 bg-teal-50/60 p-2.5 sm:p-3 rounded-lg border border-teal-100">
                <div className="inline-block font-mono text-xs font-extrabold text-teal-800">
                  {prescription.prescriptionNumber}
                </div>
                <p className="text-xs text-slate-600">
                  Date: <span className="font-semibold text-slate-900">{createdDate}</span>
                </p>
                {prescription.serialNumber && (
                  <p className="text-xs text-slate-600">
                    Serial: <span className="font-bold text-teal-700">#{prescription.serialNumber}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Doctor Info Subheader Card */}
            <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/60 p-3 rounded-lg">
              <div>
                <p className="text-base font-bold text-teal-950 font-serif">
                  {prescription.doctorName}
                </p>
                <p className="text-xs text-slate-600 font-medium">
                  {prescription.doctorQualification}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs font-bold text-teal-800">{prescription.doctorDepartment}</p>
                <p className="text-xs text-slate-500">{prescription.doctorRoom}</p>
              </div>
            </div>
          </div>

          {/* Patient Details Ribbon */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-xs shadow-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="space-y-0.5">
                <span className="text-slate-500 text-[11px] font-medium block">Patient Name</span>
                <span className="font-bold text-slate-900 text-sm block">{prescription.patientName}</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-500 text-[11px] font-medium block">Age & Gender</span>
                <span className="font-semibold text-slate-800 block">
                  {prescription.patientAge} Years / {prescription.patientGender}
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-500 text-[11px] font-medium block">Phone Contact</span>
                <span className="font-mono text-slate-800 block">{prescription.patientPhone}</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-500 text-[11px] font-medium block">Prescription Date</span>
                <span className="font-medium text-slate-800 block">{createdDate}</span>
              </div>
            </div>
          </div>

          {/* Main Clinical Body: Two Columns */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[380px]">
            {/* Left Column: Vitals, Diagnosis, Tests (35%) */}
            <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-slate-200 pb-5 md:pb-0 pr-0 md:pr-5 space-y-4 text-xs">
              {/* Clinical Vitals */}
              {prescription.vitals && (
                <div className="space-y-2 rounded-xl bg-slate-50/80 p-3.5 border border-slate-200/80 shadow-xs">
                  <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <HeartPulse className="h-3.5 w-3.5 text-teal-600" />
                    Clinical Vitals
                  </h4>
                  <div className="space-y-2 text-slate-700">
                    {prescription.vitals.bloodPressure && (
                      <div className="flex justify-between items-center py-0.5 border-b border-slate-200/50">
                        <span className="text-slate-500">Blood Pressure:</span>
                        <span className="font-bold text-slate-900">{prescription.vitals.bloodPressure}</span>
                      </div>
                    )}
                    {prescription.vitals.pulseRate && (
                      <div className="flex justify-between items-center py-0.5 border-b border-slate-200/50">
                        <span className="text-slate-500">Pulse Rate:</span>
                        <span className="font-semibold">{prescription.vitals.pulseRate}</span>
                      </div>
                    )}
                    {prescription.vitals.temperature && (
                      <div className="flex justify-between items-center py-0.5 border-b border-slate-200/50">
                        <span className="text-slate-500">Temperature:</span>
                        <span className="font-semibold">{prescription.vitals.temperature}</span>
                      </div>
                    )}
                    {prescription.vitals.weight && (
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-500">Body Weight:</span>
                        <span className="font-semibold">{prescription.vitals.weight}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Diagnosis */}
              <div className="space-y-1.5 rounded-xl bg-teal-50/50 p-3.5 border border-teal-200/70 shadow-xs">
                <h4 className="font-bold text-[11px] uppercase tracking-wider text-teal-900 flex items-center gap-1">
                  <Stethoscope className="h-3.5 w-3.5 text-teal-700" />
                  Primary Diagnosis
                </h4>
                <p className="font-bold text-slate-900 leading-snug">
                  {prescription.diagnosis}
                </p>
              </div>

              {/* Symptoms */}
              {prescription.symptoms && prescription.symptoms.length > 0 && (
                <div className="space-y-1.5 rounded-xl bg-slate-50 p-3 border border-slate-200/70">
                  <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-700">
                    Presenting Symptoms
                  </h4>
                  <ul className="list-disc pl-4 space-y-1 text-slate-700">
                    {prescription.symptoms.map((sym, idx) => (
                      <li key={idx} className="leading-tight">{sym}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommended Investigations */}
              {prescription.investigations && prescription.investigations.length > 0 && (
                <div className="space-y-2 rounded-xl bg-amber-50/70 p-3.5 border border-amber-200/80 shadow-xs">
                  <h4 className="font-bold text-[11px] uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5 text-amber-700" />
                    Recommended Investigations
                  </h4>
                  <div className="space-y-1.5 text-slate-800">
                    {prescription.investigations.map((test, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <span className="font-bold text-amber-800">{idx + 1}.</span>
                        <span className="font-medium">{test}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Rx Medications & Advice (65%) */}
            <div className="md:col-span-8 pl-0 md:pl-2 space-y-5">
              {/* Rx Symbol & Medication List */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2">
                  <span className="font-serif font-black text-3xl text-teal-700 leading-none">℞</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Prescribed Medication Schedule
                  </span>
                </div>

                <div className="space-y-2.5">
                  {prescription.medicines.map((med, index) => (
                    <div
                      key={index}
                      className="p-3 sm:p-4 rounded-xl border border-slate-200 bg-white hover:border-teal-300 transition-colors shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="h-5 w-5 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center shrink-0">
                            {index + 1}
                          </span>
                          <span className="font-bold text-slate-900 text-sm">{med.name}</span>
                        </div>
                        {med.instruction && (
                          <p className="text-xs text-slate-500 pl-7">{med.instruction}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2.5 pl-7 sm:pl-0 text-xs shrink-0">
                        <span className="rounded-md bg-teal-50 px-3 py-1 font-bold text-teal-800 border border-teal-200 shadow-2xs">
                          {med.dosage}
                        </span>
                        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-slate-700 font-medium whitespace-nowrap">
                          {med.duration}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Advice */}
              {prescription.advice && (
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-1.5 text-xs">
                  <h4 className="font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-teal-600" />
                    Special Advice & Lifestyle Directions:
                  </h4>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line pl-5">
                    {prescription.advice}
                  </p>
                </div>
              )}

              {/* Follow-up Note */}
              {prescription.followUpDate && (
                <div className="flex items-center gap-2.5 text-xs text-slate-800 bg-emerald-50/90 p-3.5 rounded-xl border border-emerald-200">
                  <Calendar className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong className="text-emerald-900 font-bold">Follow-up Review: </strong>
                    {prescription.followUpDate}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Footer Signature & Seal */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-end justify-between gap-6 text-xs text-slate-500">
            <div className="space-y-1 text-left">
              <p className="font-bold text-slate-700 flex items-center gap-1.5">
                <FileCheck2 className="h-4 w-4 text-teal-600" />
                MediCore Hospitals Digital Health Network
              </p>
              <p className="text-[11px] text-slate-400">
                Official electronic prescription. Validated by medical records department.
              </p>
            </div>

            <div className="text-center sm:text-right shrink-0">
              <div className="w-48 border-b-2 border-dashed border-teal-700/60 pb-1 mb-1.5 font-serif italic text-teal-900 font-bold text-sm">
                {prescription.doctorName}
              </div>
              <p className="text-[11px] font-bold text-slate-700">Registered Medical Practitioner</p>
              <p className="text-[10px] text-slate-400">BMDC Registered • Verified Digital Pad</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
