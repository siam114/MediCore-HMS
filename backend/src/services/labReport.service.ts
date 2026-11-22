import { ObjectId } from "mongodb";
import {
  getLabReportsCollection,
  LabReportDocument,
  SafeLabReport,
  toSafeLabReport,
  LabReportStatus,
} from "../models/labReport.model";
import { CreateLabReportInput } from "../validations/labReport.validation";

export class LabReportService {
  /**
   * Create an official diagnostic laboratory report
   */
  public static async createReport(input: CreateLabReportInput): Promise<SafeLabReport> {
    const labReports = getLabReportsCollection();

    // Generate unique report number for the day (e.g. LAB-261122-001)
    const today = new Date();
    const dateFormatted = today.toISOString().split("T")[0].replace(/-/g, "").slice(2);
    const countToday = await labReports.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    });

    const reportIndex = String(countToday + 1).padStart(3, "0");
    const reportNumber = `LAB-${dateFormatted}-${reportIndex}`;

    const now = new Date();
    const doc: LabReportDocument = {
      reportNumber,
      testName: input.testName.trim(),
      category: input.category,
      sampleType: input.sampleType?.trim() || "Clinical Specimen",
      patientId: input.patientId && ObjectId.isValid(input.patientId) ? new ObjectId(input.patientId) : undefined,
      patientName: input.patientName.trim(),
      patientPhone: input.patientPhone.trim(),
      patientAge: Number(input.patientAge),
      patientGender: input.patientGender,
      referredDoctorId: input.referredDoctorId && ObjectId.isValid(input.referredDoctorId) ? new ObjectId(input.referredDoctorId) : undefined,
      referredDoctorName: input.referredDoctorName.trim() || "Dr. SM Siam",
      prescriptionId: input.prescriptionId && ObjectId.isValid(input.prescriptionId) ? new ObjectId(input.prescriptionId) : undefined,
      parameters: input.parameters,
      clinicalImpression: input.clinicalImpression?.trim() || "Results are within acceptable clinical parameters.",
      performedBy: input.performedBy?.trim() || "Md. Rafiqul Islam, Senior Medical Technologist",
      verifiedBy: input.verifiedBy?.trim() || "Prof. Dr. M. A. Jalil, MBBS, FCPS, Consultant Pathologist",
      status: input.status,
      sampleCollectedAt: input.sampleCollectedAt ? new Date(input.sampleCollectedAt) : now,
      reportDeliveredAt: input.reportDeliveredAt ? new Date(input.reportDeliveredAt) : now,
      createdAt: now,
      updatedAt: now,
    };

    const result = await labReports.insertOne(doc);
    doc._id = result.insertedId;

    return toSafeLabReport(doc);
  }

  /**
   * Get diagnostic report by ID
   */
  public static async getReportById(id: string): Promise<SafeLabReport> {
    if (!ObjectId.isValid(id)) {
      const error: any = new Error("Invalid Report ID format");
      error.statusCode = 400;
      throw error;
    }

    const labReports = getLabReportsCollection();
    const report = await labReports.findOne({ _id: new ObjectId(id) });
    if (!report) {
      const error: any = new Error("Diagnostic report not found");
      error.statusCode = 404;
      throw error;
    }

    return toSafeLabReport(report);
  }

  /**
   * Get diagnostic reports for a patient (by patientId or patientPhone)
   */
  public static async getReportsByPatient(params: {
    patientId?: string;
    patientPhone?: string;
  }): Promise<SafeLabReport[]> {
    const labReports = getLabReportsCollection();
    const query: any = {};

    if (params.patientId && ObjectId.isValid(params.patientId)) {
      query.$or = [
        { patientId: new ObjectId(params.patientId) },
        ...(params.patientPhone ? [{ patientPhone: params.patientPhone }] : []),
      ];
    } else if (params.patientPhone) {
      query.patientPhone = params.patientPhone;
    } else {
      return [];
    }

    const docs = await labReports.find(query).sort({ createdAt: -1 }).toArray();
    return docs.map(toSafeLabReport);
  }

  /**
   * Get diagnostic reports referred by a specific doctor
   */
  public static async getReportsByDoctor(doctorId: string): Promise<SafeLabReport[]> {
    const labReports = getLabReportsCollection();
    const query: any = {};

    if (ObjectId.isValid(doctorId)) {
      query.$or = [
        { referredDoctorId: new ObjectId(doctorId) },
        { referredDoctorName: { $regex: /siam/i } },
      ];
    } else {
      query.referredDoctorName = { $regex: new RegExp(doctorId, "i") };
    }

    const docs = await labReports.find(query).sort({ createdAt: -1 }).toArray();
    return docs.map(toSafeLabReport);
  }

  /**
   * Get all reports with optional filtering (Admin/Staff view)
   */
  public static async getAllReports(filters?: {
    search?: string;
    category?: string;
    status?: string;
  }): Promise<SafeLabReport[]> {
    const labReports = getLabReportsCollection();
    const query: any = {};

    if (filters?.category) {
      query.category = filters.category;
    }

    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.search) {
      const s = filters.search.trim();
      query.$or = [
        { reportNumber: { $regex: s, $options: "i" } },
        { testName: { $regex: s, $options: "i" } },
        { patientName: { $regex: s, $options: "i" } },
        { patientPhone: { $regex: s, $options: "i" } },
        { referredDoctorName: { $regex: s, $options: "i" } },
      ];
    }

    const docs = await labReports.find(query).sort({ createdAt: -1 }).limit(100).toArray();
    return docs.map(toSafeLabReport);
  }

  /**
   * Update report status (e.g. PENDING -> COMPLETED)
   */
  public static async updateStatus(id: string, status: LabReportStatus): Promise<SafeLabReport> {
    if (!ObjectId.isValid(id)) {
      const error: any = new Error("Invalid Report ID format");
      error.statusCode = 400;
      throw error;
    }

    const labReports = getLabReportsCollection();
    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    if (status === "DELIVERED") {
      updateData.reportDeliveredAt = new Date();
    }

    const result = await labReports.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result) {
      const error: any = new Error("Diagnostic report not found");
      error.statusCode = 404;
      throw error;
    }

    return toSafeLabReport(result);
  }

  /**
   * Delete report (Admin only)
   */
  public static async deleteReport(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) {
      const error: any = new Error("Invalid Report ID format");
      error.statusCode = 400;
      throw error;
    }

    const labReports = getLabReportsCollection();
    const result = await labReports.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }
}
