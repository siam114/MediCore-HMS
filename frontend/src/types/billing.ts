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

export interface BillingInvoice {
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

export interface CreateInvoicePayload {
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
  discount?: number;
  tax?: number;
  grandTotal: number;
  paidAmount?: number;
  dueAmount?: number;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  transactionId?: string;
  notes?: string;
  issuedBy?: string;
  billingDate?: string;
}

export interface BillingStatsSummary {
  totalInvoiced: number;
  totalCollected: number;
  totalDue: number;
  todayCollection: number;
  paidCount: number;
  partialCount: number;
  unpaidCount: number;
  totalInvoices: number;
}
