"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Printer,
  Receipt,
  CheckCircle2,
  AlertCircle,
  X,
  CreditCard,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import { MediCoreLogoIcon } from "@/components/shared";
import type { BillingInvoice } from "@/types/billing";

interface ViewCashMemoDialogProps {
  invoice: BillingInvoice | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewCashMemoDialog({
  invoice,
  isOpen,
  onClose,
}: ViewCashMemoDialogProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !invoice) return null;

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
      toast.info("Generating official hospital cash memo PDF...");

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // 1. Hospital Header Top Bar
      doc.setFillColor(15, 118, 110); // Teal 700
      doc.rect(14, 12, 182, 1.8, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(15, 23, 42); // Slate 900
      doc.text("MediCore Super Speciality Hospital", 14, 21);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text("CENTRAL BILLING & PATIENT FINANCIAL SERVICES", 14, 26);
      doc.text("House 24, Road 7, Dhanmondi, Dhaka-1205  |  Helpline: +880 1567-898506  |  www.medicore.com", 14, 30);

      // Receipt Header Box on Right
      doc.setFillColor(241, 245, 249); // Slate 100
      doc.roundedRect(138, 14, 58, 18, 2, 2, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(15, 118, 110);
      doc.text("OFFICIAL CASH MEMO", 141, 19);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);
      doc.text(`Invoice No: ${invoice.invoiceNumber}`, 141, 24);
      doc.text(`Date: ${new Date(invoice.billingDate || invoice.createdAt).toLocaleDateString("en-GB")}`, 141, 28);

      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.4);
      doc.line(14, 34, 196, 34);

      // 2. Patient & Referring Doctor Information Table
      doc.setFillColor(248, 250, 252);
      doc.rect(14, 36, 182, 22, "F");
      doc.setDrawColor(226, 232, 240);
      doc.rect(14, 36, 182, 22, "S");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text("PATIENT NAME:", 17, 42);
      doc.text("PHONE NUMBER:", 17, 48);
      doc.text("AGE / GENDER:", 17, 54);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(15, 23, 42);
      doc.text(invoice.patientName, 43, 42);
      doc.text(invoice.patientPhone, 43, 48);
      doc.text(`${invoice.patientAge ? `${invoice.patientAge} Yrs` : "N/A"} / ${invoice.patientGender || "N/A"}`, 43, 54);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(71, 85, 105);
      doc.text("REF. DOCTOR:", 115, 42);
      doc.text("PAYMENT METHOD:", 115, 48);
      doc.text("PAYMENT STATUS:", 115, 54);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(15, 23, 42);
      doc.text(invoice.referredDoctorName || "Dr. SM Siam", 148, 42);
      doc.text(`${invoice.paymentMethod} ${invoice.transactionId ? `(${invoice.transactionId})` : ""}`, 148, 48);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(invoice.paymentStatus === "PAID" ? 16 : 220, invoice.paymentStatus === "PAID" ? 185 : 38, invoice.paymentStatus === "PAID" ? 129 : 38);
      doc.text(invoice.paymentStatus, 148, 54);

      // 3. Itemized Services Table Header
      let currentY = 64;
      doc.setFillColor(15, 118, 110);
      doc.rect(14, currentY, 182, 7, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text("SL", 17, currentY + 4.8);
      doc.text("SERVICE / ITEM DESCRIPTION", 27, currentY + 4.8);
      doc.text("CATEGORY", 112, currentY + 4.8);
      doc.text("QTY", 140, currentY + 4.8);
      doc.text("RATE (BDT)", 155, currentY + 4.8);
      doc.text("TOTAL (BDT)", 176, currentY + 4.8);

      currentY += 7;

      // Table Rows
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);

      invoice.items.forEach((item, index) => {
        const rowBg = index % 2 === 0 ? 255 : 248;
        doc.setFillColor(rowBg, rowBg, rowBg);
        doc.rect(14, currentY, 182, 7, "F");
        doc.setDrawColor(241, 245, 249);
        doc.line(14, currentY + 7, 196, currentY + 7);

        doc.setTextColor(71, 85, 105);
        doc.text(String(index + 1).padStart(2, "0"), 17, currentY + 5);

        doc.setTextColor(15, 23, 42);
        doc.setFont("helvetica", "bold");
        const truncatedDesc = item.description.length > 48 ? item.description.substring(0, 45) + "..." : item.description;
        doc.text(truncatedDesc, 27, currentY + 5);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(71, 85, 105);
        doc.text(item.category, 112, currentY + 5);
        doc.text(String(item.quantity), 142, currentY + 5);
        doc.text(Number(item.unitPrice).toLocaleString("en-BD"), 157, currentY + 5);

        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 23, 42);
        doc.text(Number(item.total).toLocaleString("en-BD"), 178, currentY + 5);

        currentY += 7;
      });

      // 4. Financial Calculations Box
      currentY += 4;
      const calcX = 115;
      const calcWidth = 81;

      doc.setFillColor(248, 250, 252);
      doc.rect(calcX, currentY, calcWidth, 34, "F");
      doc.setDrawColor(226, 232, 240);
      doc.rect(calcX, currentY, calcWidth, 34, "S");

      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.setFont("helvetica", "normal");
      doc.text("Sub-Total Amount:", calcX + 4, currentY + 6);
      doc.text("Special Hospital Discount:", calcX + 4, currentY + 12);
      doc.text("VAT / Tax (0%):", calcX + 4, currentY + 18);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("Net Payable (Grand Total):", calcX + 4, currentY + 24);
      doc.setTextColor(15, 118, 110);
      doc.text("Paid Amount:", calcX + 4, currentY + 29);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(15, 23, 42);
      doc.text(`BDT ${invoice.subTotal.toLocaleString("en-BD")}`, calcX + 54, currentY + 6);
      doc.text(`- BDT ${invoice.discount.toLocaleString("en-BD")}`, calcX + 54, currentY + 12);
      doc.text("BDT 0.00", calcX + 54, currentY + 18);

      doc.setFont("helvetica", "bold");
      doc.text(`BDT ${invoice.grandTotal.toLocaleString("en-BD")}`, calcX + 54, currentY + 24);
      doc.setTextColor(15, 118, 110);
      doc.text(`BDT ${invoice.paidAmount.toLocaleString("en-BD")}`, calcX + 54, currentY + 29);

      // Due Amount Badge if applicable
      if (invoice.dueAmount > 0) {
        doc.setFillColor(254, 242, 242);
        doc.rect(calcX, currentY + 34, calcWidth, 7, "F");
        doc.setDrawColor(254, 202, 202);
        doc.rect(calcX, currentY + 34, calcWidth, 7, "S");
        doc.setFont("helvetica", "bold");
        doc.setTextColor(220, 38, 38);
        doc.text("Net Due Amount:", calcX + 4, currentY + 39);
        doc.text(`BDT ${invoice.dueAmount.toLocaleString("en-BD")}`, calcX + 54, currentY + 39);
        currentY += 7;
      }

      // Notes & Info on Left
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text("TERMS & CASH MEMO CONDITIONS:", 14, currentY + 6);
      doc.text("• This is an electronically generated official computer cash memo.", 14, currentY + 11);
      doc.text("• Medicines/reagents once dispensed or consumed are non-refundable.", 14, currentY + 15);
      doc.text("• Please preserve this receipt for final discharge and tax claim.", 14, currentY + 19);

      // 5. Signatures & Hospital Stamp Footer
      const footerY = 250;
      doc.setDrawColor(203, 213, 225);
      doc.line(14, footerY, 70, footerY);
      doc.line(140, footerY, 196, footerY);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      doc.text("PREPARED & RECEIVED BY", 22, footerY + 5);
      doc.text("AUTHORIZED ACCOUNTS OFFICER", 141, footerY + 5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(invoice.issuedBy || "Accounts Desk", 22, footerY + 9);
      doc.text("Dr. SM Siam (MediCore Authority)", 141, footerY + 9);

      // Save PDF
      doc.save(`MediCore_CashMemo_${invoice.invoiceNumber}.pdf`);
      toast.success("Cash memo PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF. You can use the Print button.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  /**
   * Browser Direct Print Action
   */
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Print Specific CSS to ensure exact single-page A4 */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-cash-memo,
          #printable-cash-memo * {
            visibility: visible;
          }
          #printable-cash-memo {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            margin: 0;
            padding: 20px 24px;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Modal Dialog Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-sm animate-in fade-in no-print">
        <div className="w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          {/* Action Top Bar */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 text-white shadow-sm">
                <Receipt className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  Official Cash Memo
                  <Badge
                    variant="outline"
                    className={
                      invoice.paymentStatus === "PAID"
                        ? "border-emerald-300 bg-emerald-50 text-emerald-700 font-semibold text-[10px]"
                        : invoice.paymentStatus === "PARTIAL"
                        ? "border-amber-300 bg-amber-50 text-amber-700 font-semibold text-[10px]"
                        : "border-rose-300 bg-rose-50 text-rose-700 font-semibold text-[10px]"
                    }
                  >
                    {invoice.paymentStatus}
                  </Badge>
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {invoice.invoiceNumber} • {formatDate(invoice.billingDate || invoice.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="h-8.5 gap-1.5 text-xs font-medium cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" />
                Print A4
              </Button>
              <Button
                size="sm"
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="h-8.5 gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                {isGeneratingPdf ? "Generating..." : "Download PDF"}
              </Button>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer ml-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Printable Memo Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/60 dark:bg-slate-950/40">
            <div
              id="printable-cash-memo"
              ref={printAreaRef}
              className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            >
              {/* Memo Header */}
              <div className="border-b-2 border-teal-600 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <MediCoreLogoIcon size={30} className="shrink-0" />
                      <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                        MediCore Super Speciality Hospital
                      </h1>
                    </div>
                    <p className="text-[11px] font-semibold text-teal-700 dark:text-teal-400 mt-0.5 tracking-wide uppercase">
                      Central Billing & Patient Financial Services
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      House 24, Road 7, Dhanmondi, Dhaka-1205 | Helpline: +880 1567-898506
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block rounded-md bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-800 dark:bg-teal-950/50 dark:text-teal-300 border border-teal-200/60">
                      OFFICIAL CASH MEMO
                    </span>
                    <p className="text-[11px] font-mono font-bold text-slate-800 dark:text-slate-200 mt-1">
                      {invoice.invoiceNumber}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Date: {new Date(invoice.billingDate || invoice.createdAt).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Patient & Doctor Meta Grid */}
              <div className="mt-4 rounded-lg bg-slate-50 p-3.5 border border-slate-200/80 dark:bg-slate-800/40 dark:border-slate-800 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Patient Name:</span>
                    <strong className="text-slate-900 dark:text-slate-100">{invoice.patientName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Contact No:</span>
                    <span className="font-mono">{invoice.patientPhone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Age / Gender:</span>
                    <span>{invoice.patientAge ? `${invoice.patientAge} Yrs` : "N/A"} / {invoice.patientGender || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Ref. Physician:</span>
                    <strong className="text-teal-700 dark:text-teal-400">{invoice.referredDoctorName || "Dr. SM Siam"}</strong>
                  </div>
                </div>
                {invoice.patientAddress && (
                  <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-300">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold mr-1">Address:</span>
                    {invoice.patientAddress}
                  </div>
                )}
              </div>

              {/* Line Items Table */}
              <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-teal-600 text-white font-semibold">
                    <tr>
                      <th className="py-2 px-3 w-10">#</th>
                      <th className="py-2 px-3">Service / Item Description</th>
                      <th className="py-2 px-3 text-center">Category</th>
                      <th className="py-2 px-3 text-center">Qty</th>
                      <th className="py-2 px-3 text-right">Rate (BDT)</th>
                      <th className="py-2 px-3 text-right">Total (BDT)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {invoice.items.map((item, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/70 dark:bg-slate-800/30"}>
                        <td className="py-2.5 px-3 font-mono text-slate-400">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">
                          {item.description}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono">{item.quantity}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-600 dark:text-slate-400">
                          {Number(item.unitPrice).toLocaleString("en-BD")}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                          {Number(item.total).toLocaleString("en-BD")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Calculation Summary & Payment Info */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                {/* Payment method & notes */}
                <div className="space-y-2 text-xs">
                  <div className="rounded-lg bg-slate-50 p-3 border border-slate-200/80 dark:bg-slate-800/40 dark:border-slate-800 space-y-1">
                    <p className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <CreditCard className="h-3.5 w-3.5 text-teal-600" />
                      Payment Method:
                    </p>
                    <p className="font-mono text-[11px] text-slate-800 dark:text-slate-200">
                      <strong>{invoice.paymentMethod}</strong>
                      {invoice.transactionId ? ` (TrxID: ${invoice.transactionId})` : ""}
                    </p>
                    {invoice.notes && (
                      <p className="text-[11px] text-slate-500 pt-1 italic">
                        Note: {invoice.notes}
                      </p>
                    )}
                  </div>

                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    * This is a verified electronic hospital cash memo issued by MediCore HMS. No physical signature is mandatory for claims under BDT 50,000.
                  </p>
                </div>

                {/* Calculation breakdown */}
                <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200/80 dark:bg-slate-800/40 dark:border-slate-800 text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Sub-Total:</span>
                    <span className="font-mono font-semibold">BDT {invoice.subTotal.toLocaleString("en-BD")}</span>
                  </div>
                  {invoice.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Hospital Discount:</span>
                      <span className="font-mono">- BDT {invoice.discount.toLocaleString("en-BD")}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>VAT / Tax (0%):</span>
                    <span className="font-mono">BDT 0.00</span>
                  </div>
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-1.5 flex justify-between font-bold text-sm text-slate-900 dark:text-white">
                    <span>Net Payable:</span>
                    <span className="font-mono text-teal-700 dark:text-teal-400">BDT {invoice.grandTotal.toLocaleString("en-BD")}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-slate-800 dark:text-slate-200 pt-1 border-t border-dashed border-slate-200 dark:border-slate-700">
                    <span>Paid Amount:</span>
                    <span className="font-mono text-emerald-600">BDT {invoice.paidAmount.toLocaleString("en-BD")}</span>
                  </div>
                  {invoice.dueAmount > 0 ? (
                    <div className="flex justify-between font-bold text-rose-600 pt-1 bg-rose-50 -mx-2 px-2 py-1 rounded dark:bg-rose-950/40">
                      <span>Due Amount:</span>
                      <span className="font-mono">BDT {invoice.dueAmount.toLocaleString("en-BD")}</span>
                    </div>
                  ) : (
                    <div className="text-right text-[11px] font-bold text-emerald-600 pt-0.5 flex items-center justify-end gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Paid in Full
                    </div>
                  )}
                </div>
              </div>

              {/* Signatures */}
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-8 text-center text-xs">
                <div>
                  <div className="h-8"></div>
                  <div className="border-t border-slate-300 dark:border-slate-700 pt-1">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {invoice.issuedBy || "Accounts Desk"}
                    </p>
                    <p className="text-[10px] text-slate-400">Prepared & Received By</p>
                  </div>
                </div>
                <div>
                  <div className="h-8"></div>
                  <div className="border-t border-slate-300 dark:border-slate-700 pt-1">
                    <p className="font-semibold text-teal-700 dark:text-teal-400">
                      Dr. SM Siam
                    </p>
                    <p className="text-[10px] text-slate-400">Authorized Accounts Officer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
