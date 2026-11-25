"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Receipt,
  Plus,
  Trash2,
  Loader2,
  X,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { billingService } from "@/services/api/billing";
import type {
  BillingInvoice,
  InvoiceItem,
  BillingItemCategory,
  PaymentMethod,
} from "@/types/billing";

interface CreateInvoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newInvoice: BillingInvoice) => void;
}

export function CreateInvoiceDialog({
  isOpen,
  onClose,
  onSuccess,
}: CreateInvoiceDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Patient Info
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientAge, setPatientAge] = useState<number | "">(32);
  const [patientGender, setPatientGender] = useState<"MALE" | "FEMALE" | "OTHER">("MALE");
  const [patientAddress, setPatientAddress] = useState("Dhanmondi, Dhaka");
  const [referredDoctorName, setReferredDoctorName] = useState("Dr. SM Siam");

  // Items
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      description: "Consultation - Dr. SM Siam (Interventional Cardiology)",
      category: "CONSULTATION",
      quantity: 1,
      unitPrice: 1200,
      total: 1200,
    },
  ]);

  // Financials
  const [discount, setDiscount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(1200);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [transactionId, setTransactionId] = useState("");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  // Recalculate calculations
  const subTotal = items.reduce((sum, it) => sum + (Number(it.total) || 0), 0);
  const grandTotal = Math.max(0, subTotal - (Number(discount) || 0));
  const dueAmount = Math.max(0, grandTotal - (Number(paidAmount) || 0));

  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    val: string | number
  ) => {
    setItems((prev) => {
      const updated = [...prev];
      const item = { ...updated[index], [field]: val };
      if (field === "quantity" || field === "unitPrice") {
        item.total = Number(item.quantity || 0) * Number(item.unitPrice || 0);
      }
      updated[index] = item;
      return updated;
    });
  };

  const addItemRow = () => {
    setItems((prev) => [
      ...prev,
      {
        description: "",
        category: "LAB_TEST",
        quantity: 1,
        unitPrice: 500,
        total: 500,
      },
    ]);
  };

  const removeItemRow = (index: number) => {
    if (items.length <= 1) {
      toast.error("At least one billing item is required");
      return;
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Preset quick addition
  const addPresetItem = (
    desc: string,
    cat: BillingItemCategory,
    price: number
  ) => {
    setItems((prev) => [
      ...prev,
      {
        description: desc,
        category: cat,
        quantity: 1,
        unitPrice: price,
        total: price,
      },
    ]);
    toast.success(`Added ${desc} to bill`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientName.trim()) {
      toast.error("Patient name is required");
      return;
    }
    if (!patientPhone.trim()) {
      toast.error("Patient phone number is required");
      return;
    }
    if (items.length === 0 || !items.some((it) => it.description.trim())) {
      toast.error("Please add at least one valid line item with description");
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await billingService.create({
        patientName: patientName.trim(),
        patientPhone: patientPhone.trim(),
        patientAge: patientAge ? Number(patientAge) : undefined,
        patientGender,
        patientAddress: patientAddress.trim(),
        referredDoctorName: referredDoctorName.trim(),
        items: items.map((it) => ({
          ...it,
          quantity: Number(it.quantity) || 1,
          unitPrice: Number(it.unitPrice) || 0,
          total: (Number(it.quantity) || 1) * (Number(it.unitPrice) || 0),
        })),
        subTotal,
        discount: Number(discount) || 0,
        tax: 0,
        grandTotal,
        paidAmount: Number(paidAmount) || 0,
        dueAmount,
        paymentStatus: dueAmount === 0 ? "PAID" : paidAmount > 0 ? "PARTIAL" : "UNPAID",
        paymentMethod,
        transactionId: transactionId.trim(),
        notes: notes.trim(),
        issuedBy: "Accounts Officer (MediCore HMS)",
      });

      if (res.success && res.data?.invoice) {
        toast.success(`Invoice ${res.data.invoice.invoiceNumber} Created!`, {
          description: `Total BDT ${res.data.invoice.grandTotal.toLocaleString("en-BD")} | Status: ${res.data.invoice.paymentStatus}`,
        });
        onSuccess(res.data.invoice);
        onClose();
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to create invoice";
      toast.error("Invoice Creation Failed", { description: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-4 sm:px-5 py-3 sm:py-4 dark:border-slate-800 shrink-0 bg-slate-50/70 dark:bg-slate-900/70">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md shadow-teal-600/20">
              <Receipt className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 truncate">
                Generate Hospital Invoice
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 truncate">
                Creates official bill and records cash memo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-3.5 sm:p-6 overflow-y-auto space-y-4 text-sm flex-1">
            {/* Patient Information Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                1. Patient & Physician Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <Label htmlFor="patientName">Patient Full Name *</Label>
                  <Input
                    id="patientName"
                    placeholder="e.g. Mohammad Rahim"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="patientPhone">Contact Phone Number *</Label>
                  <Input
                    id="patientPhone"
                    placeholder="e.g. 01712345678"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="space-y-1">
                  <Label htmlFor="patientAge">Age (Years)</Label>
                  <Input
                    id="patientAge"
                    type="number"
                    min="0"
                    max="120"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value === "" ? "" : Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="patientGender">Gender</Label>
                  <select
                    id="patientGender"
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value as "MALE" | "FEMALE" | "OTHER")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="refDoc">Referring Doctor</Label>
                  <Input
                    id="refDoc"
                    value={referredDoctorName}
                    onChange={(e) => setReferredDoctorName(e.target.value)}
                    placeholder="Dr. SM Siam"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="patientAddress">Patient Address</Label>
                <Input
                  id="patientAddress"
                  value={patientAddress}
                  onChange={(e) => setPatientAddress(e.target.value)}
                  placeholder="e.g. Road 7, Dhanmondi, Dhaka"
                />
              </div>
            </div>

            {/* Quick Presets Bar */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  2. Billable Services & Items
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-teal-600 font-medium">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Quick Add:</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => addPresetItem("Cardiology Specialist Consultation - Dr. SM Siam", "CONSULTATION", 1200)}
                  className="rounded-full bg-teal-50 px-2.5 py-1 text-teal-700 hover:bg-teal-100 border border-teal-200 cursor-pointer"
                >
                  + Dr. Siam Consultation (1,200)
                </button>
                <button
                  type="button"
                  onClick={() => addPresetItem("Complete Blood Count (CBC) with ESR", "LAB_TEST", 600)}
                  className="rounded-full bg-sky-50 px-2.5 py-1 text-sky-700 hover:bg-sky-100 border border-sky-200 cursor-pointer"
                >
                  + CBC Test (600)
                </button>
                <button
                  type="button"
                  onClick={() => addPresetItem("12-Lead Electrocardiogram (ECG)", "PROCEDURE", 500)}
                  className="rounded-full bg-purple-50 px-2.5 py-1 text-purple-700 hover:bg-purple-100 border border-purple-200 cursor-pointer"
                >
                  + ECG (500)
                </button>
                <button
                  type="button"
                  onClick={() => addPresetItem("Cardiac Troponin-I Quantitative Test", "LAB_TEST", 1800)}
                  className="rounded-full bg-rose-50 px-2.5 py-1 text-rose-700 hover:bg-rose-100 border border-rose-200 cursor-pointer"
                >
                  + Troponin-I (1,800)
                </button>
              </div>
            </div>

            {/* Dynamic Line Items */}
            <div className="space-y-2.5">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-2 items-end p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <div className="col-span-12 sm:col-span-5 space-y-1">
                    <Label className="text-[11px] text-slate-500">Service Description *</Label>
                    <Input
                      placeholder="e.g. Consultation or Lab Test Name"
                      value={item.description}
                      onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                      required
                      className="h-8.5 text-xs bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-3 space-y-1">
                    <Label className="text-[11px] text-slate-500">Category</Label>
                    <select
                      value={item.category}
                      onChange={(e) => handleItemChange(idx, "category", e.target.value as BillingItemCategory)}
                      className="flex h-8.5 w-full rounded-md border border-input bg-white dark:bg-slate-900 px-2.5 pr-7 text-xs cursor-pointer"
                    >
                      <option value="CONSULTATION">Consultation</option>
                      <option value="LAB_TEST">Lab Test</option>
                      <option value="PROCEDURE">Procedure</option>
                      <option value="ADMISSION_BED">Bed / Cabin</option>
                      <option value="PHARMACY">Pharmacy</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div className="col-span-3 sm:col-span-1 space-y-1">
                    <Label className="text-[11px] text-slate-500">Qty</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, "quantity", Number(e.target.value))}
                      className="h-8.5 text-xs text-center font-mono bg-white dark:bg-slate-900 px-1"
                    />
                  </div>
                  <div className="col-span-3 sm:col-span-2 space-y-1">
                    <Label className="text-[11px] text-slate-500">Rate (BDT)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(idx, "unitPrice", Number(e.target.value))}
                      className="h-8.5 text-xs text-right font-mono bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1 flex items-center justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItemRow(idx)}
                      disabled={items.length <= 1}
                      className="h-8.5 w-8.5 p-0 text-slate-400 hover:text-red-500 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItemRow}
                className="w-full text-xs h-8.5 gap-1.5 border-dashed border-teal-300 text-teal-700 hover:bg-teal-50 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Another Item
              </Button>
            </div>

            {/* Financial Summary & Payment */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                3. Payment & Settlement
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="payMethod">Payment Method *</Label>
                    <select
                      id="payMethod"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                    >
                      <option value="CASH">Cash (Hospital Counter)</option>
                      <option value="BKASH">bKash Mobile Payment</option>
                      <option value="NAGAD">Nagad Mobile Payment</option>
                      <option value="CARD">Debit / Credit Card (POS)</option>
                      <option value="BANK_TRANSFER">Bank Wire Transfer</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="trxId">Transaction / Voucher ID</Label>
                    <Input
                      id="trxId"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="e.g. TRX88492019BK or Cash Slip No"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="memoNotes">Invoice Notes</Label>
                    <Input
                      id="memoNotes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Regular OPD consultation"
                    />
                  </div>
                </div>

                {/* Live Financial Totals Card */}
                <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-4 dark:border-teal-900/60 dark:bg-teal-950/20 text-xs space-y-2">
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Sub-Total:</span>
                    <span className="font-mono font-semibold">BDT {subTotal.toLocaleString("en-BD")}</span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-600 dark:text-slate-300">Discount (BDT):</span>
                    <Input
                      type="number"
                      min="0"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      className="w-28 h-8 text-right font-mono text-xs bg-white dark:bg-slate-900"
                    />
                  </div>

                  <div className="border-t border-teal-200/80 dark:border-teal-900 pt-2 flex justify-between font-bold text-sm text-slate-900 dark:text-white">
                    <span>Grand Total:</span>
                    <span className="font-mono text-teal-700 dark:text-teal-400">
                      BDT {grandTotal.toLocaleString("en-BD")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-1 border-t border-dashed border-teal-200 dark:border-teal-900">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Paid Now:</span>
                    <Input
                      type="number"
                      min="0"
                      value={paidAmount}
                      onChange={(e) => setPaidAmount(Number(e.target.value))}
                      className="w-28 h-8 text-right font-mono font-bold text-emerald-700 text-xs bg-white dark:bg-slate-900"
                    />
                  </div>

                  <div className="flex justify-between font-bold pt-1 text-slate-800 dark:text-slate-200">
                    <span>Due Amount:</span>
                    <span className={`font-mono ${dueAmount > 0 ? "text-rose-600 font-bold" : "text-emerald-600"}`}>
                      BDT {dueAmount.toLocaleString("en-BD")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Sticky Footer */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 px-4 sm:px-6 py-3 border-t border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/70 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="cursor-pointer w-full sm:w-auto h-10 sm:h-9"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-teal-600 hover:bg-teal-700 text-white font-medium shadow-sm cursor-pointer w-full sm:w-auto h-10 sm:h-9"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Invoice...
                </>
              ) : (
                "Save & Print Cash Memo"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
