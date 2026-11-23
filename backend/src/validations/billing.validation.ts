import { z } from "zod";

export const invoiceItemSchema = z.object({
  description: z.string().min(1, "Item description is required"),
  category: z.enum([
    "CONSULTATION",
    "LAB_TEST",
    "ADMISSION_BED",
    "PHARMACY",
    "PROCEDURE",
    "OTHER",
  ] as const),
  quantity: z.coerce.number().min(1).default(1),
  unitPrice: z.coerce.number().min(0),
  total: z.coerce.number().min(0),
});

export const createBillingSchema = z.object({
  patientId: z.string().optional().or(z.literal("")),
  patientName: z.string().min(2, "Patient name is required"),
  patientPhone: z.string().min(6, "Valid contact number is required"),
  patientAge: z.coerce.number().min(0).max(125).optional(),
  patientGender: z.enum(["MALE", "FEMALE", "OTHER"] as const).optional(),
  patientAddress: z.string().optional().default(""),
  referredDoctorId: z.string().optional().or(z.literal("")),
  referredDoctorName: z.string().optional().default("Dr. SM Siam"),
  appointmentId: z.string().optional().or(z.literal("")),
  items: z.array(invoiceItemSchema).min(1, "At least one billing item is required"),
  subTotal: z.coerce.number().min(0),
  discount: z.coerce.number().min(0).default(0),
  tax: z.coerce.number().min(0).default(0),
  grandTotal: z.coerce.number().min(0),
  paidAmount: z.coerce.number().min(0).default(0),
  dueAmount: z.coerce.number().min(0).default(0),
  paymentStatus: z.enum(["PAID", "PARTIAL", "UNPAID"] as const).default("PAID"),
  paymentMethod: z.enum([
    "CASH",
    "BKASH",
    "NAGAD",
    "CARD",
    "BANK_TRANSFER",
  ] as const).default("CASH"),
  transactionId: z.string().optional().default(""),
  notes: z.string().optional().default(""),
  issuedBy: z.string().optional().default("Accounts Desk (MediCore HMS)"),
  billingDate: z.string().optional(),
});

export const recordPaymentSchema = z.object({
  additionalPaid: z.coerce.number().min(1, "Payment amount must be greater than zero"),
  paymentMethod: z.enum([
    "CASH",
    "BKASH",
    "NAGAD",
    "CARD",
    "BANK_TRANSFER",
  ] as const),
  transactionId: z.string().optional().default(""),
});

export type CreateBillingInput = z.infer<typeof createBillingSchema>;
export type RecordPaymentInput = z.infer<typeof recordPaymentSchema>;
