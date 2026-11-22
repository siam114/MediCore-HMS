import { ObjectId } from "mongodb";
import {
  getAppointmentsCollection,
  AppointmentDocument,
  SafeAppointment,
  toSafeAppointment,
  AppointmentStatus,
  PaymentStatus,
} from "../models/appointment.model";
import { getDoctorsCollection } from "../models/doctor.model";
import { CreateAppointmentInput } from "../validations/appointment.validation";

export class AppointmentService {
  /**
   * Create and book a new appointment serial
   */
  public static async createAppointment(
    input: CreateAppointmentInput,
    patientUserId?: string
  ): Promise<SafeAppointment> {
    const doctors = getDoctorsCollection();
    const appointments = getAppointmentsCollection();

    if (!ObjectId.isValid(input.doctorId)) {
      const error: any = new Error("Invalid Doctor ID format");
      error.statusCode = 400;
      throw error;
    }

    const doctor = await doctors.findOne({ _id: new ObjectId(input.doctorId) });
    if (!doctor) {
      const error: any = new Error("Specialist doctor not found");
      error.statusCode = 404;
      throw error;
    }

    // Generate unique serial number for the day (e.g. MC-261122-005)
    const dateFormatted = input.appointmentDate.replace(/-/g, "").slice(2); // YYMMDD
    const countToday = await appointments.countDocuments({
      doctorId: doctor._id,
      appointmentDate: input.appointmentDate,
    });

    const serialIndex = String(countToday + 1).padStart(3, "0");
    const serialNumber = `MC-${dateFormatted}-${serialIndex}`;

    const now = new Date();
    const appointmentDoc: AppointmentDocument = {
      serialNumber,
      doctorId: doctor._id!,
      doctorName: doctor.name,
      doctorDepartment: doctor.department,
      patientId: patientUserId && ObjectId.isValid(patientUserId) ? new ObjectId(patientUserId) : undefined,
      patientName: input.patientName.trim(),
      patientPhone: input.patientPhone.trim(),
      patientEmail: input.patientEmail ? input.patientEmail.trim().toLowerCase() : undefined,
      patientAge: Number(input.patientAge),
      patientGender: input.patientGender,
      appointmentDate: input.appointmentDate,
      appointmentTime: input.appointmentTime,
      problemDescription: input.problemDescription ? input.problemDescription.trim() : undefined,
      consultationFee: doctor.consultationFee,
      roomNumber: doctor.roomNumber,
      status: "CONFIRMED", // Auto-confirmed on serial generation
      paymentStatus: "UNPAID",
      createdAt: now,
      updatedAt: now,
    };

    const result = await appointments.insertOne(appointmentDoc);
    appointmentDoc._id = result.insertedId;

    return toSafeAppointment(appointmentDoc);
  }

  /**
   * Get appointments for the logged-in patient
   */
  public static async getPatientAppointments(
    patientUserId?: string,
    phone?: string
  ): Promise<SafeAppointment[]> {
    const appointments = getAppointmentsCollection();
    const query: any = {};

    if (patientUserId && ObjectId.isValid(patientUserId)) {
      query.$or = [{ patientId: new ObjectId(patientUserId) }];
      if (phone) {
        query.$or.push({ patientPhone: phone });
      }
    } else if (phone) {
      query.patientPhone = phone;
    } else {
      return [];
    }

    const docs = await appointments.find(query).sort({ createdAt: -1 }).toArray();
    return docs.map(toSafeAppointment);
  }

  /**
   * Get appointments for a specific doctor
   */
  public static async getDoctorAppointments(
    doctorId: string,
    date?: string
  ): Promise<SafeAppointment[]> {
    const appointments = getAppointmentsCollection();

    if (!ObjectId.isValid(doctorId)) {
      const error: any = new Error("Invalid Doctor ID");
      error.statusCode = 400;
      throw error;
    }

    const query: any = { doctorId: new ObjectId(doctorId) };
    if (date) {
      query.appointmentDate = date;
    }

    const docs = await appointments.find(query).sort({ appointmentDate: 1, serialNumber: 1 }).toArray();
    return docs.map(toSafeAppointment);
  }

  /**
   * Get all appointments (Admin control)
   */
  public static async getAllAppointments(filters?: {
    date?: string;
    status?: string;
    department?: string;
  }): Promise<{ appointments: SafeAppointment[]; total: number }> {
    const appointments = getAppointmentsCollection();
    const query: any = {};

    if (filters?.date) query.appointmentDate = filters.date;
    if (filters?.status) query.status = filters.status;
    if (filters?.department && filters.department !== "All") query.doctorDepartment = filters.department;

    const [docs, total] = await Promise.all([
      appointments.find(query).sort({ createdAt: -1 }).toArray(),
      appointments.countDocuments(query),
    ]);

    return {
      appointments: docs.map(toSafeAppointment),
      total,
    };
  }

  /**
   * Update appointment status
   */
  public static async updateAppointmentStatus(
    id: string,
    status: AppointmentStatus,
    paymentStatus?: PaymentStatus
  ): Promise<SafeAppointment> {
    const appointments = getAppointmentsCollection();

    if (!ObjectId.isValid(id)) {
      const error: any = new Error("Invalid Appointment ID format");
      error.statusCode = 400;
      throw error;
    }

    const updateFields: any = {
      status,
      updatedAt: new Date(),
    };

    if (paymentStatus) {
      updateFields.paymentStatus = paymentStatus;
    }

    const result = await appointments.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateFields },
      { returnDocument: "after" }
    );

    if (!result) {
      const error: any = new Error("Appointment not found");
      error.statusCode = 404;
      throw error;
    }

    return toSafeAppointment(result);
  }
}
