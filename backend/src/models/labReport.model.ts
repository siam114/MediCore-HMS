import { ObjectId, Collection } from "mongodb";
import { getCollection } from "../config/db";

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

export interface LabReportDocument {
  _id?: ObjectId;
  reportNumber: string; // e.g. "LAB-261122-001"
  testName: string; // e.g. "Complete Blood Count (CBC)"
  category: LabTestCategory;
  sampleType?: string; // e.g. "Whole Blood EDTA", "Serum", "Digital X-Ray"
  patientId?: ObjectId;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientGender: "MALE" | "FEMALE" | "OTHER";
  referredDoctorId?: ObjectId;
  referredDoctorName: string;
  prescriptionId?: ObjectId;
  parameters: LabTestParameter[];
  clinicalImpression?: string;
  performedBy?: string;
  verifiedBy?: string;
  status: LabReportStatus;
  sampleCollectedAt: Date;
  reportDeliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SafeLabReport {
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

export function toSafeLabReport(doc: LabReportDocument): SafeLabReport {
  return {
    id: doc._id?.toString() || "",
    reportNumber: doc.reportNumber,
    testName: doc.testName,
    category: doc.category,
    sampleType: doc.sampleType,
    patientId: doc.patientId?.toString(),
    patientName: doc.patientName,
    patientPhone: doc.patientPhone,
    patientAge: doc.patientAge,
    patientGender: doc.patientGender,
    referredDoctorId: doc.referredDoctorId?.toString(),
    referredDoctorName: doc.referredDoctorName,
    prescriptionId: doc.prescriptionId?.toString(),
    parameters: doc.parameters,
    clinicalImpression: doc.clinicalImpression,
    performedBy: doc.performedBy,
    verifiedBy: doc.verifiedBy,
    status: doc.status,
    sampleCollectedAt: doc.sampleCollectedAt.toISOString(),
    reportDeliveredAt: doc.reportDeliveredAt?.toISOString(),
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export function getLabReportsCollection(): Collection<LabReportDocument> {
  return getCollection<LabReportDocument>("lab_reports");
}
