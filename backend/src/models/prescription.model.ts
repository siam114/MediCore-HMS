import { ObjectId, Collection } from "mongodb";
import { getCollection } from "../config/db";

export interface PrescriptionMedicine {
  name: string;
  dosage: string; // e.g. "1+0+1"
  duration: string; // e.g. "7 Days"
  instruction: string; // e.g. "After meal"
}

export interface PatientVitals {
  bloodPressure?: string; // e.g. "120/80 mmHg"
  pulseRate?: string; // e.g. "76 bpm"
  temperature?: string; // e.g. "98.4 °F"
  weight?: string; // e.g. "70 kg"
}

export interface PrescriptionDocument {
  _id?: ObjectId;
  prescriptionNumber: string; // e.g. "RX-261122-001"
  appointmentId?: ObjectId;
  serialNumber?: string;
  doctorId: ObjectId;
  doctorName: string;
  doctorDepartment: string;
  doctorQualification: string;
  doctorRoom: string;
  patientId?: ObjectId;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientGender: "MALE" | "FEMALE" | "OTHER";
  vitals?: PatientVitals;
  diagnosis: string;
  symptoms?: string[];
  medicines: PrescriptionMedicine[];
  investigations?: string[]; // Recommended diagnostic tests
  advice?: string;
  followUpDate?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SafePrescription {
  id: string;
  prescriptionNumber: string;
  appointmentId?: string;
  serialNumber?: string;
  doctorId: string;
  doctorName: string;
  doctorDepartment: string;
  doctorQualification: string;
  doctorRoom: string;
  patientId?: string;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientGender: "MALE" | "FEMALE" | "OTHER";
  vitals?: PatientVitals;
  diagnosis: string;
  symptoms?: string[];
  medicines: PrescriptionMedicine[];
  investigations?: string[];
  advice?: string;
  followUpDate?: string;
  createdAt: Date;
  updatedAt: Date;
}

export function getPrescriptionsCollection(): Collection<PrescriptionDocument> {
  return getCollection<PrescriptionDocument>("prescriptions");
}

export function toSafePrescription(doc: PrescriptionDocument): SafePrescription {
  return {
    id: doc._id ? doc._id.toString() : "",
    prescriptionNumber: doc.prescriptionNumber,
    appointmentId: doc.appointmentId ? doc.appointmentId.toString() : undefined,
    serialNumber: doc.serialNumber,
    doctorId: doc.doctorId.toString(),
    doctorName: doc.doctorName,
    doctorDepartment: doc.doctorDepartment,
    doctorQualification: doc.doctorQualification,
    doctorRoom: doc.doctorRoom,
    patientId: doc.patientId ? doc.patientId.toString() : undefined,
    patientName: doc.patientName,
    patientPhone: doc.patientPhone,
    patientAge: doc.patientAge,
    patientGender: doc.patientGender,
    vitals: doc.vitals,
    diagnosis: doc.diagnosis,
    symptoms: doc.symptoms,
    medicines: doc.medicines,
    investigations: doc.investigations,
    advice: doc.advice,
    followUpDate: doc.followUpDate,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}
