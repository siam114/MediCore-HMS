export interface LabTestParameter {
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  isAbnormal?: boolean;
}

export type LabTestCategory =
  | "HEMATOLOGY"
  | "BIOCHEMISTRY"
  | "MICROBIOLOGY"
  | "RADIOLOGY"
  | "CARDIOLOGY"
  | "PATHOLOGY";

export type LabReportStatus = "PENDING" | "COMPLETED" | "DELIVERED";

export interface LabReport {
  id: string;
  reportNumber: string;
  testName: string;
  category: LabTestCategory;
  sampleType?: string;
  patientId?: string;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientGender: "MALE" | "FEMALE" | "OTHER";
  referredDoctorId?: string;
  referredDoctorName: string;
  prescriptionId?: string;
  parameters: LabTestParameter[];
  clinicalImpression?: string;
  performedBy?: string;
  verifiedBy?: string;
  status: LabReportStatus;
  sampleCollectedAt: string;
  reportDeliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLabReportPayload {
  testName: string;
  category: LabTestCategory;
  sampleType?: string;
  patientId?: string;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientGender: "MALE" | "FEMALE" | "OTHER";
  referredDoctorId?: string;
  referredDoctorName: string;
  prescriptionId?: string;
  parameters: LabTestParameter[];
  clinicalImpression?: string;
  performedBy?: string;
  verifiedBy?: string;
  status?: LabReportStatus;
}
