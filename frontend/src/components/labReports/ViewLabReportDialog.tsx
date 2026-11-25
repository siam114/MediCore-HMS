"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Printer,
  FileCheck2,
  AlertTriangle,
  FlaskConical,
  CheckCircle2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import type { LabReport } from "@/types/labReport";

interface ViewLabReportDialogProps {
  report: LabReport | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewLabReportDialog({
  report,
  isOpen,
  onClose,
}: ViewLabReportDialogProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !report) return null;

  // Format date helper
  const formatDate = (isoString?: string) => {
    if (!isoString) return "N/A";
    const d = new Date(isoString);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /**
   * High-Precision Direct Vector PDF Generation (1-Page A4)
   */
  const handleDownloadPdf = () => {
    try {
      setIsGeneratingPdf(true);
      toast.info("Generating official diagnostic report PDF...");

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // 1. Hospital Header
      doc.setFillColor(15, 118, 110); // Teal 700
      doc.rect(14, 12, 182, 1.5, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(15, 23, 42); // Slate 900
      doc.text("MediCore Hospitals & Diagnostic Center", 14, 21);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text("DEPARTMENT OF PATHOLOGY & CLINICAL LABORATORY MEDICINE", 14, 26);
      doc.text("Plot 14, Block C, Gulshan-2, Dhaka-1212  |  Hotline: +880 1567-898506  |  www.medicore.com", 14, 30);

      // Report Header Box on Right
      doc.setFillColor(241, 245, 249); // Slate 100
      doc.roundedRect(140, 14, 56, 17, 2, 2, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(15, 118, 110);
      doc.text("OFFICIAL LAB REPORT", 143, 19);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);
      doc.text(`Report No: ${report.reportNumber}`, 143, 24);
      doc.text(`Date: ${new Date(report.createdAt).toLocaleDateString("en-GB")}`, 143, 28);

      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.4);
      doc.line(14, 33, 196, 33);

      // 2. Patient & Referring Doctor Information Table
      doc.setFillColor(248, 250, 252);
      doc.rect(14, 35, 182, 20, "F");
      doc.rect(14, 35, 182, 20, "S");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("PATIENT NAME", 18, 39);
      doc.text("AGE & GENDER", 78, 39);
      doc.text("CONTACT NO", 115, 39);
      doc.text("SAMPLE TYPE", 155, 39);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(report.patientName, 18, 44);
      doc.text(`${report.patientAge} Years / ${report.patientGender}`, 78, 44);
      doc.text(report.patientPhone, 115, 44);
      doc.text(report.sampleType || "Blood / Serum", 155, 44);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("REFERRED BY PHYSICIAN", 18, 49);
      doc.text("COLLECTED AT", 115, 49);
      doc.text("STATUS", 155, 49);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(15, 118, 110);
      doc.text(report.referredDoctorName || "Dr. SM Siam", 18, 53);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text(new Date(report.sampleCollectedAt).toLocaleDateString("en-GB"), 115, 53);
      doc.text(report.status, 155, 53);

      // 3. Test Banner Title
      doc.setFillColor(15, 118, 110);
      doc.rect(14, 58, 182, 7, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(255, 255, 255);
      doc.text(`TEST: ${report.testName.toUpperCase()} [${report.category}]`, 18, 63);

      // 4. Parameters Table Header
      let currentY = 70;
      doc.setFillColor(241, 245, 249);
      doc.rect(14, currentY, 182, 6, "F");
      doc.setDrawColor(203, 213, 225);
      doc.rect(14, currentY, 182, 6, "S");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      doc.text("INVESTIGATION / PARAMETER", 18, currentY + 4.2);
      doc.text("OBSERVED VALUE", 95, currentY + 4.2);
      doc.text("UNIT", 130, currentY + 4.2);
      doc.text("REFERENCE INTERVAL", 155, currentY + 4.2);

      currentY += 6;

      // 5. Test Parameter Rows
      report.parameters.forEach((param, index) => {
        const rowHeight = 6.5;

        if (index % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(14, currentY, 182, rowHeight, "F");
        }

        doc.setDrawColor(226, 232, 240);
        doc.line(14, currentY + rowHeight, 196, currentY + rowHeight);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(30, 41, 59);
        doc.text(param.name, 18, currentY + 4.5);

        // Value column: bold if abnormal
        if (param.isAbnormal) {
          doc.setFont("helvetica", "bold");
          doc.setTextColor(190, 18, 60); // Red
          doc.text(`${param.value} *`, 95, currentY + 4.5);
        } else {
          doc.setFont("helvetica", "bold");
          doc.setTextColor(15, 23, 42);
          doc.text(param.value, 95, currentY + 4.5);
        }

        doc.setFont("helvetica", "normal");
        doc.setTextColor(71, 85, 105);
        doc.text(param.unit || "-", 130, currentY + 4.5);
        doc.text(param.referenceRange || "-", 155, currentY + 4.5);

        currentY += rowHeight;
      });

      // 6. Clinical Impression / Remarks
      currentY += 4;
      doc.setFillColor(254, 252, 232); // Light yellow box
      doc.setDrawColor(254, 240, 138);
      doc.rect(14, currentY, 182, 14, "F");
      doc.rect(14, currentY, 182, 14, "S");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(133, 77, 14);
      doc.text("CLINICAL IMPRESSION & INTERPRETATION:", 18, currentY + 4.5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      const impressionLines = doc.splitTextToSize(
        report.clinicalImpression || "Results are verified and within physiological biological reference range.",
        174
      );
      doc.text(impressionLines, 18, currentY + 9);

      // 7. Verified Signatures
      currentY = 250;
      doc.setDrawColor(148, 163, 184);
      doc.line(18, currentY, 75, currentY);
      doc.line(135, currentY, 192, currentY);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text("REPORT PREPARED BY", 18, currentY + 4);
      doc.text("VERIFIED & APPROVED BY", 135, currentY + 4);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(71, 85, 105);
      doc.text(report.performedBy || "Md. Rafiqul Islam, Senior Technologist", 18, currentY + 7.5);
      doc.text(report.verifiedBy || "Chief Consultant Pathologist", 135, currentY + 7.5);

      // 8. Footer Bar
      doc.setDrawColor(203, 213, 225);
      doc.line(14, 268, 196, 268);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(148, 163, 184);
      doc.text(
        "MediCore Diagnostic Health Network  |  Electronically Verified Lab Report  |  Helpline: +880 1567-898506",
        14,
        272
      );
      doc.text("Page 1 of 1", 185, 272);

      // Save PDF
      doc.save(`LabReport_${report.reportNumber}.pdf`);
      toast.success(`Lab Report ${report.reportNumber} downloaded successfully!`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF. Using print dialog instead.");
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  /**
   * Native Single-Sheet A4 Printing
   */
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      {/* Print Stylesheet */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #official-lab-report-pad,
          #official-lab-report-pad * {
            visibility: visible;
          }
          #official-lab-report-pad {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            background: white !important;
            color: black !important;
          }
          [data-sonner-toaster],
          [data-sonner-toast] {
            display: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 8mm 10mm;
          }
        }
      `}</style>

      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 print:hidden shrink-0 gap-3">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <div className="flex items-center gap-2 min-w-0 pr-2">
              <FlaskConical className="h-5 w-5 text-teal-600 dark:text-teal-400 shrink-0" />
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                Lab Report — {report.reportNumber}
              </h3>
            </div>
            {/* Close button visible in top row on mobile */}
            <button
              onClick={onClose}
              className="sm:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="gap-1.5 text-xs font-semibold h-9 px-3 sm:px-4 rounded-xl cursor-pointer flex-1 sm:flex-initial"
            >
              <Printer className="h-3.5 w-3.5" />
              Print Report
            </Button>

            <Button
              size="sm"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="gap-1.5 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white h-9 px-3.5 sm:px-4.5 rounded-xl shadow-xs cursor-pointer flex-1 sm:flex-initial"
            >
              <Download className="h-3.5 w-3.5" />
              {isGeneratingPdf ? "Generating..." : "Download PDF"}
            </Button>

            <button
              onClick={onClose}
              className="hidden sm:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Report Content - Scrollable on Screen, Fits A4 Single Sheet on Print */}
        <div className="overflow-y-auto p-4 sm:p-6 flex-1 bg-slate-100 dark:bg-slate-950 flex justify-center">
          <div
            id="official-lab-report-pad"
            ref={printAreaRef}
            className="w-full max-w-3xl bg-white text-slate-900 p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 print:border-none print:shadow-none print:p-2 space-y-5"
          >
            {/* 1. Hospital Diagnostic Header */}
            <div className="border-b-2 border-teal-600 pb-3 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-black text-sm">
                    MC
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    MediCore Hospitals & Diagnostic Center
                  </h2>
                </div>
                <p className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
                  DEPARTMENT OF PATHOLOGY & CLINICAL LABORATORY MEDICINE
                </p>
                <p className="text-[10px] text-slate-500">
                  Plot 14, Block C, Gulshan-2, Dhaka-1212 • Hotline: +880 1567-898506 • www.medicore.com
                </p>
              </div>

              <div className="text-right shrink-0 bg-slate-50 border border-slate-200 rounded-xl p-2.5 space-y-0.5">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-extrabold bg-teal-50 text-teal-800 border border-teal-200">
                  OFFICIAL LAB REPORT
                </span>
                <p className="text-xs font-mono font-bold text-slate-900">
                  {report.reportNumber}
                </p>
                <p className="text-[10px] text-slate-500">
                  {formatDate(report.createdAt)}
                </p>
              </div>
            </div>

            {/* 2. Patient & Referring Doctor Information Banner */}
            <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3.5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold uppercase text-slate-400">Patient Name</p>
                <p className="font-bold text-slate-900">{report.patientName}</p>
              </div>

              <div className="space-y-0.5">
                <p className="text-[10px] font-bold uppercase text-slate-400">Age & Gender</p>
                <p className="font-bold text-slate-900">
                  {report.patientAge} Years / {report.patientGender}
                </p>
              </div>

              <div className="space-y-0.5">
                <p className="text-[10px] font-bold uppercase text-slate-400">Phone Contact</p>
                <p className="font-semibold text-slate-700">{report.patientPhone}</p>
              </div>

              <div className="space-y-0.5">
                <p className="text-[10px] font-bold uppercase text-slate-400">Sample Type</p>
                <p className="font-semibold text-slate-700">{report.sampleType || "Blood / Serum"}</p>
              </div>

              <div className="sm:col-span-2 space-y-0.5 pt-1 border-t border-slate-200/60">
                <p className="text-[10px] font-bold uppercase text-slate-400">Referred By Consultant</p>
                <p className="font-bold text-teal-700">{report.referredDoctorName || "Dr. SM Siam"}</p>
              </div>

              <div className="space-y-0.5 pt-1 border-t border-slate-200/60">
                <p className="text-[10px] font-bold uppercase text-slate-400">Sample Collected</p>
                <p className="text-slate-700 font-medium">{formatDate(report.sampleCollectedAt)}</p>
              </div>

              <div className="space-y-0.5 pt-1 border-t border-slate-200/60">
                <p className="text-[10px] font-bold uppercase text-slate-400">Report Status</p>
                <Badge
                  variant={report.status === "COMPLETED" || report.status === "DELIVERED" ? "default" : "secondary"}
                  className="text-[10px] font-bold"
                >
                  {report.status}
                </Badge>
              </div>
            </div>

            {/* 3. Investigation Title Bar */}
            <div className="bg-teal-700 text-white px-4 py-2 rounded-xl flex items-center justify-between">
              <span className="font-black text-sm tracking-wide">
                TEST: {report.testName.toUpperCase()}
              </span>
              <span className="text-xs font-semibold bg-teal-800/80 px-2.5 py-0.5 rounded-md text-teal-100">
                {report.category}
              </span>
            </div>

            {/* 4. Pathology Parameter Table */}
            <div className="border border-slate-200 rounded-xl overflow-x-auto">
              <table className="w-full min-w-[500px] text-left text-xs">
                <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3.5">Investigation / Parameter</th>
                    <th className="py-2.5 px-3">Observed Result</th>
                    <th className="py-2.5 px-3">Unit</th>
                    <th className="py-2.5 px-3">Reference Interval</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {report.parameters.map((param, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 1 ? "bg-slate-50/50" : "bg-white"}
                    >
                      <td className="py-2 px-3.5 font-medium text-slate-800">
                        {param.name}
                      </td>
                      <td className="py-2 px-3">
                        <span
                          className={`font-mono font-bold ${
                            param.isAbnormal
                              ? "text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200"
                              : "text-slate-900"
                          }`}
                        >
                          {param.value}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-500 font-mono">
                        {param.unit || "-"}
                      </td>
                      <td className="py-2 px-3 text-slate-600 font-mono">
                        {param.referenceRange || "-"}
                      </td>
                      <td className="py-2 px-3 text-right">
                        {param.isAbnormal ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600">
                            <AlertTriangle className="h-3 w-3" /> Abnormal
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                            <CheckCircle2 className="h-3 w-3" /> Normal
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 5. Clinical Impression Box */}
            <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3 text-xs space-y-1">
              <span className="font-bold text-amber-900 uppercase tracking-wide text-[10px] flex items-center gap-1">
                <FileCheck2 className="h-3.5 w-3.5 text-amber-700" />
                Clinical Interpretation & Notes
              </span>
              <p className="text-slate-700 leading-relaxed font-normal">
                {report.clinicalImpression ||
                  "Results are within acceptable physiological limits. Correlate clinically."}
              </p>
            </div>

            {/* 6. Technologist & Pathologist Signatures */}
            <div className="pt-8 grid grid-cols-2 gap-8 text-xs border-t border-slate-200/80">
              <div className="space-y-1">
                <div className="w-40 border-b border-slate-400 pb-1 font-serif italic text-slate-400 text-xs">
                  Lab Technologist
                </div>
                <p className="font-bold text-slate-900">{report.performedBy || "Medical Technologist"}</p>
                <p className="text-[10px] text-slate-500">Department of Clinical Laboratory</p>
              </div>

              <div className="space-y-1 text-right sm:text-left sm:pl-16">
                <div className="w-44 ml-auto sm:ml-0 border-b border-slate-400 pb-1 font-serif italic text-teal-800 text-xs">
                  Pathologist Verification
                </div>
                <p className="font-bold text-slate-900">{report.verifiedBy || "Consultant Pathologist"}</p>
                <p className="text-[10px] text-slate-500">MBBS, FCPS / MD (Pathology)</p>
              </div>
            </div>

            {/* 7. Footer */}
            <div className="pt-3 border-t border-slate-200 text-center text-[10px] text-slate-400">
              MediCore Hospitals Digital Health Network • Electronically Signed & Verified Report • 24/7 Helpline: +880 1567-898506
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
