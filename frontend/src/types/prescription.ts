export interface PrescriptionMedicine {
  name: string;
  dosage: string;
  duration: string;
  instruction: string;
}

export interface PatientVitals {
  bloodPressure?: string;
  pulseRate?: string;
  temperature?: string;
  weight?: string;
}

export interface Prescription {
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
  createdAt: string;
  updatedAt: string;
}

export interface CreatePrescriptionPayload {
  appointmentId?: string;
  serialNumber?: string;
  doctorId: string;
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
}
