import { ObjectId } from "mongodb";
import {
  getPrescriptionsCollection,
  PrescriptionDocument,
  SafePrescription,
  toSafePrescription,
} from "../models/prescription.model";
import { getDoctorsCollection } from "../models/doctor.model";
import { getAppointmentsCollection } from "../models/appointment.model";
import { CreatePrescriptionInput } from "../validations/prescription.validation";

export class PrescriptionService {
  /**
   * Create an official E-Prescription
   */
  public static async createPrescription(input: CreatePrescriptionInput): Promise<SafePrescription> {
    const prescriptions = getPrescriptionsCollection();
    const doctors = getDoctorsCollection();
    const appointments = getAppointmentsCollection();

    if (!ObjectId.isValid(input.doctorId)) {
      const error: any = new Error("Invalid Doctor ID format");
      error.statusCode = 400;
      throw error;
    }

    const doctor = await doctors.findOne({ _id: new ObjectId(input.doctorId) });
    if (!doctor) {
      const error: any = new Error("Doctor not found");
      error.statusCode = 404;
      throw error;
    }

    // Generate unique prescription number for the day (e.g. RX-261122-001)
    const today = new Date();
    const dateFormatted = today.toISOString().split("T")[0].replace(/-/g, "").slice(2);
    const countToday = await prescriptions.countDocuments({
      doctorId: doctor._id,
      createdAt: {
        $gte: new Date(today.setHours(0, 0, 0, 0)),
      },
    });

    const rxIndex = String(countToday + 1).padStart(3, "0");
    const prescriptionNumber = `RX-${dateFormatted}-${rxIndex}`;

    const now = new Date();
    const doc: PrescriptionDocument = {
      prescriptionNumber,
      appointmentId: input.appointmentId && ObjectId.isValid(input.appointmentId) ? new ObjectId(input.appointmentId) : undefined,
      serialNumber: input.serialNumber || undefined,
      doctorId: doctor._id!,
      doctorName: doctor.name,
      doctorDepartment: doctor.department,
      doctorQualification: doctor.qualification,
      doctorRoom: doctor.roomNumber,
      patientId: input.patientId && ObjectId.isValid(input.patientId) ? new ObjectId(input.patientId) : undefined,
      patientName: input.patientName.trim(),
      patientPhone: input.patientPhone.trim(),
      patientAge: Number(input.patientAge),
      patientGender: input.patientGender,
      vitals: input.vitals,
      diagnosis: input.diagnosis.trim(),
      symptoms: input.symptoms,
      medicines: input.medicines,
      investigations: input.investigations,
      advice: input.advice,
      followUpDate: input.followUpDate,
      createdAt: now,
      updatedAt: now,
    };

    const result = await prescriptions.insertOne(doc);
    doc._id = result.insertedId;

    // If linked to an appointment, auto-mark the appointment as COMPLETED
    if (doc.appointmentId) {
      await appointments.updateOne(
        { _id: doc.appointmentId },
        { $set: { status: "COMPLETED", updatedAt: now } }
      );
    }

    return toSafePrescription(doc);
  }

  /**
   * Get prescription by ID
   */
  public static async getById(id: string): Promise<SafePrescription | null> {
    const prescriptions = getPrescriptionsCollection();
    if (!ObjectId.isValid(id)) return null;

    const doc = await prescriptions.findOne({ _id: new ObjectId(id) });
    return doc ? toSafePrescription(doc) : null;
  }

  /**
   * Get prescriptions for a specific doctor
   */
  public static async getByDoctor(doctorId: string): Promise<SafePrescription[]> {
    const prescriptions = getPrescriptionsCollection();
    if (!ObjectId.isValid(doctorId)) return [];

    const docs = await prescriptions
      .find({ doctorId: new ObjectId(doctorId) })
      .sort({ createdAt: -1 })
      .toArray();

    return docs.map(toSafePrescription);
  }

  /**
   * Get prescriptions for a patient (by patientId or phone)
   */
  public static async getByPatient(patientId?: string, phone?: string): Promise<SafePrescription[]> {
    const prescriptions = getPrescriptionsCollection();
    const query: any = {};

    if (patientId && ObjectId.isValid(patientId)) {
      query.$or = [{ patientId: new ObjectId(patientId) }];
      if (phone) query.$or.push({ patientPhone: phone });
    } else if (phone) {
      query.patientPhone = phone;
    } else {
      return [];
    }

    const docs = await prescriptions.find(query).sort({ createdAt: -1 }).toArray();
    return docs.map(toSafePrescription);
  }

  /**
   * Get all prescriptions (Admin/Hospital registry)
   */
  public static async getAll(department?: string): Promise<SafePrescription[]> {
    const prescriptions = getPrescriptionsCollection();
    const query: any = {};
    if (department && department !== "All") {
      query.doctorDepartment = department;
    }

    const docs = await prescriptions.find(query).sort({ createdAt: -1 }).toArray();
    return docs.map(toSafePrescription);
  }
}
