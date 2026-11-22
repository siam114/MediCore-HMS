import { z } from "zod";

export const createAppointmentSchema = z.object({
  doctorId: z.string().min(1, "Doctor ID is required"),
  patientName: z.string().min(2, "Patient name must be at least 2 characters").max(100),
  patientPhone: z.string().min(6, "Valid contact phone number is required").max(20),
  patientEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
  patientAge: z.coerce.number().min(0, "Age cannot be negative").max(125, "Please enter a valid age"),
  patientGender: z.enum(["MALE", "FEMALE", "OTHER"] as const),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Appointment date must be in YYYY-MM-DD format"),
  appointmentTime: z.string().min(1, "Preferred consultation time is required"),
  problemDescription: z.string().max(500, "Problem description cannot exceed 500 characters").optional().or(z.literal("")),
});

export const updateAppointmentStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"] as const),
  paymentStatus: z.enum(["UNPAID", "PAID"] as const).optional(),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentStatusInput = z.infer<typeof updateAppointmentStatusSchema>;
