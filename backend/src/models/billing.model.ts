import { ObjectId, Collection } from "mongodb";
import { getCollection } from "../config/db";

export type BillingItemCategory =
  | "CONSULTATION"
  | "LAB_TEST"
  | "ADMISSION_BED"
  | "PHARMACY"
  | "PROCEDURE"
  | "OTHER";

export type PaymentStatus = "PAID" | "PARTIAL" | "UNPAID";

export type PaymentMethod =
  | "CASH"
  | "BKASH"
  | "NAGAD"
  | "CARD"
  | "BANK_TRANSFER";

export interface InvoiceItem {
  description: string;
  category: BillingItemCategory;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface BillingDocument {
  _id?: ObjectId;
  invoiceNumber: string; // e.g. "INV-202611-0101"
  patientId?: ObjectId;
  patientName: string;
  patientPhone: string;
  patientAge?: number;
  patientGender?: "MALE" | "FEMALE" | "OTHER";
  patientAddress?: string;
  referredDoctorId?: ObjectId;
  referredDoctorName?: string;
  appointmentId?: ObjectId;
  items: InvoiceItem[];
  subTotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  notes?: string;
  issuedBy: string;
  billingDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SafeBilling {
  id: string;
  invoiceNumber: string;
  patientId?: string;
  patientName: string;
  patientPhone: string;
  patientAge?: number;
  patientGender?: "MALE" | "FEMALE" | "OTHER";
  patientAddress?: string;
  referredDoctorId?: string;
  referredDoctorName?: string;
  appointmentId?: string;
  items: InvoiceItem[];
  subTotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  notes?: string;
  issuedBy: string;
  billingDate: string;
  createdAt: string;
  updatedAt: string;
}

export const toSafeBilling = (doc: BillingDocument): SafeBilling => {
  return {
    id: doc._id!.toString(),
    invoiceNumber: doc.invoiceNumber,
    patientId: doc.patientId?.toString(),
    patientName: doc.patientName,
    patientPhone: doc.patientPhone,
    patientAge: doc.patientAge,
    patientGender: doc.patientGender,
    patientAddress: doc.patientAddress,
    referredDoctorId: doc.referredDoctorId?.toString(),
    referredDoctorName: doc.referredDoctorName,
    appointmentId: doc.appointmentId?.toString(),
    items: doc.items,
    subTotal: doc.subTotal,
    discount: doc.discount,
    tax: doc.tax,
    grandTotal: doc.grandTotal,
    paidAmount: doc.paidAmount,
    dueAmount: doc.dueAmount,
    paymentStatus: doc.paymentStatus,
    paymentMethod: doc.paymentMethod,
    transactionId: doc.transactionId,
    notes: doc.notes,
    issuedBy: doc.issuedBy,
    billingDate: doc.billingDate.toISOString(),
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
};

export const getBillingCollection = (): Collection<BillingDocument> => {
  return getCollection<BillingDocument>("billings");
};
