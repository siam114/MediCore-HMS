import { z } from "zod";
import { HOSPITAL_DEPARTMENTS } from "../constants/departments";

export const createDoctorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is required"),
  department: z.string().min(2, "Department is required"),
  specialization: z.string().min(2, "Specialization is required"),
  qualification: z.string().min(2, "Qualification is required (e.g. MBBS, FCPS)"),
  experienceYears: z.number().int().min(0, "Experience years must be positive").default(0),
  consultationFee: z.number().positive("Consultation fee must be greater than 0"),
  availableDays: z.array(z.string()).min(1, "Select at least one available day"),
  availableTime: z.object({
    start: z.string().default("09:00 AM"),
    end: z.string().default("05:00 PM"),
  }),
  roomNumber: z.string().min(1, "Room/Chamber number is required"),
  defaultPassword: z.string().min(6).optional().default("Doctor@123"),
});

export const updateDoctorSchema = createDoctorSchema.partial();

export type CreateDoctorInput = z.infer<typeof createDoctorSchema>;
export type UpdateDoctorInput = z.infer<typeof updateDoctorSchema>;
