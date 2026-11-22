import { z } from "zod";

export const labTestParameterSchema = z.object({
  name: z.string().min(1, "Parameter name is required"),
  value: z.string().min(1, "Parameter result value is required"),
  unit: z.string().default(""),
  referenceRange: z.string().default(""),
  isAbnormal: z.boolean().default(false),
});

export const createLabReportSchema = z.object({
  testName: z.string().min(2, "Test name is required"),
  category: z.enum([
    "HEMATOLOGY",
    "BIOCHEMISTRY",
    "MICROBIOLOGY",
    "RADIOLOGY",
    "CARDIOLOGY",
    "PATHOLOGY",
  ] as const),
  sampleType: z.string().optional().default(""),
  patientId: z.string().optional().or(z.literal("")),
  patientName: z.string().min(2, "Patient name is required"),
  patientPhone: z.string().min(6, "Valid contact number is required"),
  patientAge: z.coerce.number().min(0).max(125),
  patientGender: z.enum(["MALE", "FEMALE", "OTHER"] as const),
  referredDoctorId: z.string().optional().or(z.literal("")),
  referredDoctorName: z.string().default("Dr. SM Siam"),
  prescriptionId: z.string().optional().or(z.literal("")),
  parameters: z.array(labTestParameterSchema).min(1, "At least one test parameter result is required"),
  clinicalImpression: z.string().optional().default(""),
  performedBy: z.string().optional().default("Lab Technologist (MediCore)"),
  verifiedBy: z.string().optional().default("Consultant Pathologist (MediCore)"),
  status: z.enum(["PENDING", "COMPLETED", "DELIVERED"] as const).default("COMPLETED"),
  sampleCollectedAt: z.string().optional(),
  reportDeliveredAt: z.string().optional(),
});

export const updateLabReportStatusSchema = z.object({
  status: z.enum(["PENDING", "COMPLETED", "DELIVERED"] as const),
});

export type CreateLabReportInput = z.infer<typeof createLabReportSchema>;
export type UpdateLabReportStatusInput = z.infer<typeof updateLabReportStatusSchema>;
