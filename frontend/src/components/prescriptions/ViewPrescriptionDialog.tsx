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

  /**
   * Generates a 100% reliable, crystal-clear vector PDF directly using jsPDF.
   * Free of canvas/CSS variable parsing bugs, instant download, and perfect A4 single-page format.
   */
  const handleDownloadPdf = async () => {
    try {
      setIsDownloading(true);

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Top Teal Accent Bar
      doc.setFillColor(13, 148, 136); // Teal 600
      doc.rect(0, 0, 210, 5, "F");

      // Hospital Letterhead
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(15, 23, 42); // Slate 900
      doc.text("MediCore Hospitals", 14, 16);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(13, 148, 136);
      doc.text("TERTIARY CARE & SPECIALIST RESEARCH CENTER", 14, 21);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text("Plot 14, Block C, Gulshan-2, Dhaka-1212  |  Hotline: +880 1567-898506  |  www.medicore.com", 14, 25);

      // Prescription Reference Box (Top Right)
      doc.setFillColor(240, 253, 250);
      doc.setDrawColor(204, 251, 241);
      doc.roundedRect(138, 9, 58, 18, 2, 2, "FD");

      doc.setFont("courier", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(15, 118, 110);
      doc.text(prescription.prescriptionNumber, 142, 15);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text(`Date: ${new Date(prescription.createdAt).toLocaleDateString("en-GB")}`, 142, 20);
      if (prescription.serialNumber) {
        doc.text(`Chamber Serial: #${prescription.serialNumber}`, 142, 24);
      }

      // Divider Line below Header
      doc.setDrawColor(226, 232, 240);
      doc.line(14, 30, 196, 30);

      // Doctor Information Subheader
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(19, 78, 74);
      doc.text(prescription.doctorName, 14, 36);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text(prescription.doctorQualification, 14, 40.5);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(13, 148, 136);
      doc.text(prescription.doctorDepartment, 196, 36, { align: "right" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(prescription.doctorRoom, 196, 40.5, { align: "right" });

      // Patient Info Card
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(14, 44, 182, 13, 2, 2, "FD");

      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(71, 85, 105);
      doc.text("Patient Name:", 18, 51);
      doc.setTextColor(15, 23, 42);
      doc.text(prescription.patientName, 39, 51);

      doc.setTextColor(71, 85, 105);
      doc.text("Age / Gender:", 85, 51);
      doc.setTextColor(15, 23, 42);
      doc.text(`${prescription.patientAge} Y / ${prescription.patientGender}`, 106, 51);

      doc.setTextColor(71, 85, 105);
      doc.text("Contact:", 145, 51);
      doc.setTextColor(15, 23, 42);
      doc.text(prescription.patientPhone, 158, 51);

      // Vertical Divider Line (Column separator)
      doc.setDrawColor(226, 232, 240);
      doc.line(70, 61, 70, 252);

      // LEFT COLUMN: Vitals, Diagnosis, Symptoms, Tests
      let leftY = 66;

      // Vitals
      if (prescription.vitals) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(15, 118, 110);
        doc.text("CLINICAL VITALS", 14, leftY);
        leftY += 4.5;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(71, 85, 105);

        if (prescription.vitals.bloodPressure) {
          doc.text(`Blood Pressure: ${prescription.vitals.bloodPressure}`, 14, leftY);
          leftY += 4;
        }
        if (prescription.vitals.pulseRate) {
          doc.text(`Pulse Rate: ${prescription.vitals.pulseRate}`, 14, leftY);
          leftY += 4;
        }
        if (prescription.vitals.temperature) {
          doc.text(`Temperature: ${prescription.vitals.temperature}`, 14, leftY);
          leftY += 4;
        }
        if (prescription.vitals.weight) {
          doc.text(`Body Weight: ${prescription.vitals.weight}`, 14, leftY);
          leftY += 4;
        }
        leftY += 3;
      }

      // Diagnosis
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(15, 118, 110);
      doc.text("PRIMARY DIAGNOSIS", 14, leftY);
      leftY += 4.5;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      const diagLines = doc.splitTextToSize(prescription.diagnosis, 52);
      doc.text(diagLines, 14, leftY);
      leftY += (diagLines.length * 4) + 4;

      // Symptoms
      if (prescription.symptoms && prescription.symptoms.length > 0) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(15, 118, 110);
        doc.text("SYMPTOMS", 14, leftY);
        leftY += 4.5;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(71, 85, 105);
        prescription.symptoms.forEach((sym) => {
          const symLines = doc.splitTextToSize(`• ${sym}`, 52);
          doc.text(symLines, 14, leftY);
          leftY += (symLines.length * 3.8);
        });
        leftY += 3;
      }

      // Recommended Investigations
      if (prescription.investigations && prescription.investigations.length > 0) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(180, 83, 9);
        doc.text("INVESTIGATIONS", 14, leftY);
        leftY += 4.5;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(51, 65, 85);
        prescription.investigations.forEach((test, idx) => {
          const testLines = doc.splitTextToSize(`${idx + 1}. ${test}`, 52);
          doc.text(testLines, 14, leftY);
          leftY += (testLines.length * 3.8);
        });
      }

      // RIGHT COLUMN: ℞ Medications & Directions
      let rightY = 66;

      // ℞ Symbol Header
      doc.setFont("times", "bolditalic");
      doc.setFontSize(20);
      doc.setTextColor(13, 148, 136);
      doc.text("Rx", 74, rightY);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(15, 118, 110);
      doc.text("PRESCRIBED MEDICATION SCHEDULE", 86, rightY - 1);
      rightY += 7;

      // Medicines list
      prescription.medicines.forEach((med, idx) => {
        // Medicine row card
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(74, rightY - 3.5, 122, 13, 1.5, 1.5, "FD");

        // Index circle & Medicine Name
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(15, 23, 42);
        doc.text(`${idx + 1}. ${med.name}`, 77, rightY + 1);

        // Dosage tag
        doc.setFillColor(240, 253, 250);
        doc.setDrawColor(153, 246, 228);
        doc.roundedRect(158, rightY - 2, 18, 5, 1, 1, "FD");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(15, 118, 110);
        doc.text(med.dosage, 167, rightY + 1.5, { align: "center" });

        // Duration tag
        doc.setFillColor(241, 245, 249);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(178, rightY - 2, 16, 5, 1, 1, "FD");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(71, 85, 105);
        doc.text(med.duration, 186, rightY + 1.5, { align: "center" });

        // Instructions
        if (med.instruction) {
          doc.setFont("helvetica", "italic");
          doc.setFontSize(7);
          doc.setTextColor(100, 116, 139);
          doc.text(med.instruction, 81, rightY + 6);
        }

        rightY += 15.5;
      });

      // Special Advice
      if (prescription.advice) {
        rightY += 1;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(15, 118, 110);
        doc.text("SPECIAL ADVICE & DIRECTIONS:", 74, rightY);
        rightY += 4.5;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(51, 65, 85);
        const advLines = doc.splitTextToSize(prescription.advice, 122);
        doc.text(advLines, 74, rightY);
        rightY += (advLines.length * 3.8) + 4;
      }

      // Follow-up
      if (prescription.followUpDate) {
        doc.setFillColor(236, 253, 245);
        doc.setDrawColor(167, 243, 208);
        doc.roundedRect(74, rightY - 2.5, 122, 7.5, 1.5, 1.5, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(6, 95, 70);
        doc.text(`Follow-up Review: ${prescription.followUpDate}`, 78, rightY + 2);
      }

      // FOOTER SECTION (Fixed near page bottom)
      doc.setDrawColor(226, 232, 240);
      doc.line(14, 260, 196, 260);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text("MediCore Hospitals Digital Health Network  |  Valid Electronic Prescription  |  Helpline: +880 1567-898506", 14, 266);

      // Doctor's Signature Area
      doc.setDrawColor(100, 116, 139);
      doc.line(145, 274, 196, 274);

      doc.setFont("times", "bolditalic");
      doc.setFontSize(10);
      doc.setTextColor(19, 78, 74);
      doc.text(prescription.doctorName, 170, 271, { align: "center" });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(71, 85, 105);
      doc.text("Registered Medical Practitioner", 170, 278, { align: "center" });

      // Save official PDF
      doc.save(`Prescription_${prescription.prescriptionNumber}.pdf`);
      toast.success("Prescription PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("PDF download encountered an issue, opening print preview...");
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
    <>
      {/* Global Print-specific CSS ensuring strictly 1 page A4 and hiding all browser/toast overlays */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm 10mm;
          }
          html, body {
            height: auto !important;
            overflow: visible !important;
            background: #ffffff !important;
            color: #000000 !important;
          }
          /* Hide EVERYTHING on the page except the prescription modal */
          header, footer, nav, aside,
          [data-sonner-toaster], [data-sonner-toast],
          .print\\:hidden {
            display: none !important;
            visibility: hidden !important;
          }
          #print-modal-overlay {
            position: static !important;
            padding: 0 !important;
            margin: 0 !important;
            background: transparent !important;
            overflow: visible !important;
            height: auto !important;
            max-height: none !important;
          }
          #print-modal-card {
            border: none !important;
            box-shadow: none !important;
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            max-height: none !important;
            overflow: visible !important;
          }
          #prescription-pad {
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            box-shadow: none !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      <div
        id="print-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 sm:p-4 md:p-6 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200 print:bg-transparent print:p-0 print:static print:overflow-visible"
      >
        <div
          id="print-modal-card"
          className="relative w-full max-w-4xl my-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden flex flex-col max-h-[94vh] print:max-h-none print:shadow-none print:border-none print:overflow-visible print:w-full print:max-w-none"
        >
          {/* Top Action Bar (always hidden on print) */}
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

            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Direct PDF Download Button */}
              <Button
                size="sm"
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                className="bg-teal-600 hover:bg-teal-700 text-white gap-2 text-xs font-bold px-4.5 py-2.5 h-10 rounded-xl shadow-md shadow-teal-600/25 cursor-pointer transition-all hover:scale-[1.02]"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download PDF
                  </>
                )}
              </Button>

              {/* Native Print Button */}
              <Button
                size="sm"
                variant="outline"
                onClick={handlePrint}
                className="text-slate-700 border-slate-300 hover:bg-slate-100 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800 gap-2 text-xs font-bold px-4.5 py-2.5 h-10 rounded-xl cursor-pointer shadow-xs"
              >
                <Printer className="h-4 w-4" />
                Print
              </Button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors ml-1 cursor-pointer"
                title="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Prescription Paper Pad Container */}
          <div
            id="prescription-pad"
            className="overflow-y-auto p-4 sm:p-7 md:p-9 space-y-4 sm:space-y-5 bg-white text-slate-900 print:p-0 print:m-0 print:space-y-3 print:overflow-visible print:max-w-none print:shadow-none"
          >
            {/* Top Brand Stripe */}
            <div className="h-2 w-full rounded-full bg-gradient-to-r from-teal-800 via-teal-600 to-emerald-600 mb-2 print:mb-1.5" />

            {/* Hospital Letterhead Header */}
            <div className="border-b-2 border-teal-800/80 pb-3 print:pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:flex-row print:items-center">
                <div className="flex items-start sm:items-center gap-3 print:flex-row print:items-center">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-700 text-white shadow-md print:h-10 print:w-10">
                    <Activity className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-serif print:text-xl">
                      MediCore Hospitals
                    </h1>
                    <p className="text-[11px] font-bold text-teal-800 uppercase tracking-wider print:text-[10px]">
                      Tertiary Care & Specialist Research Center
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5 print:text-[9px]">
                      Plot 14, Block C, Gulshan-2, Dhaka-1212 • Hotline: +880 1567-898506 • www.medicore.com
                    </p>
                  </div>
                </div>

                {/* Rx Ref & Date */}
                <div className="text-left sm:text-right space-y-0.5 shrink-0 bg-teal-50/70 p-2 rounded-lg border border-teal-100 print:text-right print:p-1.5">
                  <div className="inline-block font-mono text-xs font-extrabold text-teal-800 print:text-[11px]">
                    {prescription.prescriptionNumber}
                  </div>
                  <p className="text-[11px] text-slate-600 print:text-[10px]">
                    Date: <span className="font-semibold text-slate-900">{createdDate}</span>
                  </p>
                  {prescription.serialNumber && (
                    <p className="text-[11px] text-slate-600 print:text-[10px]">
                      Serial: <span className="font-bold text-teal-700">#{prescription.serialNumber}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Doctor Info Subheader Card */}
              <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 bg-slate-50/70 p-2.5 rounded-lg print:flex-row print:items-center print:py-1.5 print:mt-2">
                <div>
                  <p className="text-sm sm:text-base font-bold text-teal-950 font-serif print:text-sm">
                    {prescription.doctorName}
                  </p>
                  <p className="text-[11px] text-slate-600 font-medium print:text-[10px]">
                    {prescription.doctorQualification}
                  </p>
                </div>
                <div className="text-left sm:text-right print:text-right">
                  <p className="text-[11px] font-bold text-teal-800 print:text-[10px]">{prescription.doctorDepartment}</p>
                  <p className="text-[10px] text-slate-500">{prescription.doctorRoom}</p>
                </div>
              </div>
            </div>

            {/* Patient Details Ribbon */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-xs shadow-xs print:p-2 print:rounded-lg">
              <div className="grid grid-cols-2 sm:grid-cols-4 print:grid-cols-4 gap-2.5">
                <div className="space-y-0.5">
                  <span className="text-slate-500 text-[10px] font-medium block">Patient Name</span>
                  <span className="font-bold text-slate-900 text-xs sm:text-sm print:text-xs block">{prescription.patientName}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-500 text-[10px] font-medium block">Age & Gender</span>
                  <span className="font-semibold text-slate-800 text-xs block">
                    {prescription.patientAge} Years / {prescription.patientGender}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-500 text-[10px] font-medium block">Phone Contact</span>
                  <span className="font-mono text-slate-800 text-xs block">{prescription.patientPhone}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-500 text-[10px] font-medium block">Prescription Date</span>
                  <span className="font-medium text-slate-800 text-xs block">{createdDate}</span>
                </div>
              </div>
            </div>

            {/* Main Clinical Body: Two Columns (FORCED print:grid-cols-12 so it NEVER collapses into 1 vertical column in print!) */}
            <div className="grid grid-cols-1 md:grid-cols-12 print:grid-cols-12 gap-5 print:gap-4 min-h-[340px] print:min-h-0">
              {/* Left Column: Vitals, Diagnosis, Tests (35%) */}
              <div className="md:col-span-4 print:col-span-4 border-b md:border-b-0 md:border-r print:border-b-0 print:border-r border-slate-200 pb-4 md:pb-0 print:pb-0 pr-0 md:pr-4 print:pr-4 space-y-3.5 print:space-y-2.5 text-xs">
                {/* Clinical Vitals */}
                {prescription.vitals && (
                  <div className="space-y-1.5 rounded-xl bg-slate-50/80 p-3 print:p-2 border border-slate-200/80 shadow-xs print:shadow-none">
                    <h4 className="font-bold text-[10px] uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <HeartPulse className="h-3 w-3 text-teal-600" />
                      Clinical Vitals
                    </h4>
                    <div className="space-y-1 text-slate-700 text-[11px] print:text-[10px]">
                      {prescription.vitals.bloodPressure && (
                        <div className="flex justify-between items-center py-0.5 border-b border-slate-200/50">
                          <span className="text-slate-500">BP:</span>
                          <span className="font-bold text-slate-900">{prescription.vitals.bloodPressure}</span>
                        </div>
                      )}
                      {prescription.vitals.pulseRate && (
                        <div className="flex justify-between items-center py-0.5 border-b border-slate-200/50">
                          <span className="text-slate-500">Pulse:</span>
                          <span className="font-semibold">{prescription.vitals.pulseRate}</span>
                        </div>
                      )}
                      {prescription.vitals.temperature && (
                        <div className="flex justify-between items-center py-0.5 border-b border-slate-200/50">
                          <span className="text-slate-500">Temp:</span>
                          <span className="font-semibold">{prescription.vitals.temperature}</span>
                        </div>
                      )}
                      {prescription.vitals.weight && (
                        <div className="flex justify-between items-center py-0.5">
                          <span className="text-slate-500">Weight:</span>
                          <span className="font-semibold">{prescription.vitals.weight}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Diagnosis */}
                <div className="space-y-1 rounded-xl bg-teal-50/50 p-3 print:p-2 border border-teal-200/70 shadow-xs print:shadow-none">
                  <h4 className="font-bold text-[10px] uppercase tracking-wider text-teal-900 flex items-center gap-1">
                    <Stethoscope className="h-3 w-3 text-teal-700" />
                    Diagnosis
                  </h4>
                  <p className="font-bold text-slate-900 text-xs leading-snug">
                    {prescription.diagnosis}
                  </p>
                </div>

                {/* Symptoms */}
                {prescription.symptoms && prescription.symptoms.length > 0 && (
                  <div className="space-y-1 rounded-xl bg-slate-50 p-2.5 print:p-2 border border-slate-200/70">
                    <h4 className="font-bold text-[10px] uppercase tracking-wider text-slate-700">
                      Symptoms
                    </h4>
                    <ul className="list-disc pl-3.5 space-y-0.5 text-slate-700 text-[11px] print:text-[10px]">
                      {prescription.symptoms.map((sym, idx) => (
                        <li key={idx} className="leading-tight">{sym}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommended Investigations */}
                {prescription.investigations && prescription.investigations.length > 0 && (
                  <div className="space-y-1.5 rounded-xl bg-amber-50/70 p-3 print:p-2 border border-amber-200/80 shadow-xs print:shadow-none">
                    <h4 className="font-bold text-[10px] uppercase tracking-wider text-amber-900 flex items-center gap-1">
                      <Activity className="h-3 w-3 text-amber-700" />
                      Investigations
                    </h4>
                    <div className="space-y-1 text-slate-800 text-[11px] print:text-[10px]">
                      {prescription.investigations.map((test, idx) => (
                        <div key={idx} className="flex items-start gap-1">
                          <span className="font-bold text-amber-800">{idx + 1}.</span>
                          <span className="font-medium">{test}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Rx Medications & Advice (65%) */}
              <div className="md:col-span-8 print:col-span-8 pl-0 md:pl-2 print:pl-2 space-y-4 print:space-y-2.5">
                {/* Rx Symbol & Medication List */}
                <div className="space-y-2.5 print:space-y-2">
                  <div className="flex items-center gap-2 border-b border-slate-200/80 pb-1.5 print:pb-1">
                    <span className="font-serif font-black text-2xl sm:text-3xl print:text-2xl text-teal-700 leading-none">℞</span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                      Prescribed Medication Schedule
                    </span>
                  </div>

                  <div className="space-y-2 print:space-y-1.5">
                    {prescription.medicines.map((med, index) => (
                      <div
                        key={index}
                        className="p-2.5 sm:p-3 print:p-2 rounded-xl border border-slate-200 bg-white hover:border-teal-300 transition-colors shadow-xs print:shadow-none flex flex-col sm:flex-row print:flex-row sm:items-center print:items-center justify-between gap-2"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="h-4.5 w-4.5 rounded-full bg-teal-100 text-teal-800 font-bold text-[11px] flex items-center justify-center shrink-0">
                              {index + 1}
                            </span>
                            <span className="font-bold text-slate-900 text-xs sm:text-sm print:text-xs">{med.name}</span>
                          </div>
                          {med.instruction && (
                            <p className="text-[11px] print:text-[10px] text-slate-500 pl-6.5">{med.instruction}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 pl-6.5 sm:pl-0 print:pl-0 text-xs print:text-[10px] shrink-0">
                          <span className="rounded-md bg-teal-50 px-2.5 py-0.5 font-bold text-teal-800 border border-teal-200">
                            {med.dosage}
                          </span>
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-700 font-medium whitespace-nowrap">
                            {med.duration}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Special Advice */}
                {prescription.advice && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 print:p-2 space-y-1 text-xs print:text-[10px]">
                    <h4 className="font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 text-[10px]">
                      <FileText className="h-3 w-3 text-teal-600" />
                      Advice & Directions:
                    </h4>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line pl-4">
                      {prescription.advice}
                    </p>
                  </div>
                )}

                {/* Follow-up Note */}
                {prescription.followUpDate && (
                  <div className="flex items-center gap-2 text-xs print:text-[10px] text-slate-800 bg-emerald-50/90 p-2.5 print:p-1.5 rounded-xl border border-emerald-200">
                    <Calendar className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>
                      <strong className="text-emerald-900 font-bold">Follow-up Review: </strong>
                      {prescription.followUpDate}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Signature & Seal (Strictly formatted on the same single page) */}
            <div className="pt-4 print:pt-3 border-t border-slate-200 flex flex-col sm:flex-row print:flex-row items-end justify-between gap-4 text-xs text-slate-500 print:mt-1">
              <div className="space-y-0.5 text-left">
                <p className="font-bold text-slate-700 flex items-center gap-1.5 text-[11px] print:text-[10px]">
                  <FileCheck2 className="h-3.5 w-3.5 text-teal-600" />
                  MediCore Hospitals Digital Health Network
                </p>
                <p className="text-[10px] text-slate-400 print:text-[9px]">
                  Official electronic prescription. Validated by medical records department.
                </p>
              </div>

              <div className="text-center sm:text-right print:text-right shrink-0">
                <div className="w-44 border-b-2 border-dashed border-teal-700/60 pb-1 mb-1 font-serif italic text-teal-900 font-bold text-xs sm:text-sm print:text-xs">
                  {prescription.doctorName}
                </div>
                <p className="text-[10px] font-bold text-slate-700">Registered Medical Practitioner</p>
                <p className="text-[9px] text-slate-400">BMDC Registered • Verified Digital Pad</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
