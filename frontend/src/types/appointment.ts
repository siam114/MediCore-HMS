export type AppointmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
export type PaymentStatus = "UNPAID" | "PAID";
export type PatientGender = "MALE" | "FEMALE" | "OTHER";

export interface Appointment {
  id: string;
  serialNumber: string;
  doctorId: string;
  doctorName: string;
  doctorDepartment: string;
  patientId?: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  patientAge: number;
  patientGender: PatientGender;
  appointmentDate: string;
  appointmentTime: string;
  problemDescription?: string;
  consultationFee: number;
  roomNumber: string;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentInput {
  doctorId: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  patientAge: number;
  patientGender: PatientGender;
  appointmentDate: string;
  appointmentTime: string;
  problemDescription?: string;
}
