import { ObjectId, Collection } from "mongodb";
import { getCollection } from "../config/db";

export type AppointmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
export type PaymentStatus = "UNPAID" | "PAID";
export type PatientGender = "MALE" | "FEMALE" | "OTHER";

export interface AppointmentDocument {
  _id?: ObjectId;
  serialNumber: string;
  doctorId: ObjectId;
  doctorName: string;
  doctorDepartment: string;
  patientId?: ObjectId;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  patientAge: number;
  patientGender: PatientGender;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // e.g. "05:30 PM"
  problemDescription?: string;
  consultationFee: number;
  roomNumber: string;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface SafeAppointment {
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
  createdAt: Date;
  updatedAt: Date;
}

export function getAppointmentsCollection(): Collection<AppointmentDocument> {
  return getCollection<AppointmentDocument>("appointments");
}

export function toSafeAppointment(doc: AppointmentDocument): SafeAppointment {
  return {
    id: doc._id ? doc._id.toString() : "",
    serialNumber: doc.serialNumber,
    doctorId: doc.doctorId.toString(),
    doctorName: doc.doctorName,
    doctorDepartment: doc.doctorDepartment,
    patientId: doc.patientId ? doc.patientId.toString() : undefined,
    patientName: doc.patientName,
    patientPhone: doc.patientPhone,
    patientEmail: doc.patientEmail,
    patientAge: doc.patientAge,
    patientGender: doc.patientGender,
    appointmentDate: doc.appointmentDate,
    appointmentTime: doc.appointmentTime,
    problemDescription: doc.problemDescription,
    consultationFee: doc.consultationFee,
    roomNumber: doc.roomNumber,
    status: doc.status,
    paymentStatus: doc.paymentStatus,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}
