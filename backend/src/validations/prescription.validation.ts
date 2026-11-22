import { z } from "zod";

export const medicineSchema = z.object({
  name: z.string().min(1, "Medicine name is required"),
  dosage: z.string().min(1, "Dosage is required (e.g. 1+0+1)"),
  duration: z.string().min(1, "Duration is required (e.g. 7 Days)"),
  instruction: z.string().default("After meal"),
});

export const vitalsSchema = z.object({
  bloodPressure: z.string().optional().or(z.literal("")),
  pulseRate: z.string().optional().or(z.literal("")),
  temperature: z.string().optional().or(z.literal("")),
  weight: z.string().optional().or(z.literal("")),
});

export const createPrescriptionSchema = z.object({
  appointmentId: z.string().optional().or(z.literal("")),
  serialNumber: z.string().optional().or(z.literal("")),
  doctorId: z.string().min(1, "Doctor ID is required"),
  patientId: z.string().optional().or(z.literal("")),
  patientName: z.string().min(2, "Patient name must be at least 2 characters"),
  patientPhone: z.string().min(6, "Valid phone number is required"),
  patientAge: z.coerce.number().min(0).max(125),
  patientGender: z.enum(["MALE", "FEMALE", "OTHER"] as const),
  vitals: vitalsSchema.optional(),
  diagnosis: z.string().min(2, "Diagnosis is required"),
  symptoms: z.array(z.string()).optional().default([]),
  medicines: z.array(medicineSchema).min(1, "At least one medicine must be prescribed"),
  investigations: z.array(z.string()).optional().default([]),
  advice: z.string().optional().default(""),
  followUpDate: z.string().optional().default(""),
});

export type CreatePrescriptionInput = z.infer<typeof createPrescriptionSchema>;
