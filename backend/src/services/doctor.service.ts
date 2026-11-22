import { ObjectId } from "mongodb";
import {
  getDoctorsCollection,
  DoctorDocument,
  toSafeDoctor,
  SafeDoctor,
} from "../models/doctor.model";
import { getUsersCollection, hashPassword, UserDocument } from "../models/user.model";
import { USER_ROLES } from "../constants/roles";
import { CreateDoctorInput, UpdateDoctorInput } from "../validations/doctor.validation";

export class DoctorService {
  public static async createDoctor(input: CreateDoctorInput): Promise<SafeDoctor> {
    const doctors = getDoctorsCollection();
    const users = getUsersCollection();
    const normalizedEmail = input.email.toLowerCase().trim();

    // Check if doctor profile with this email already exists
    const existingDoctor = await doctors.findOne({ email: normalizedEmail });
    if (existingDoctor) {
      const error: any = new Error("A doctor with this email is already registered");
      error.statusCode = 409;
      throw error;
    }

    const now = new Date();

    // Create or link a user account for the doctor to enable login
    let user = await users.findOne({ email: normalizedEmail });
    let userId: ObjectId;

    if (!user) {
      const hashedPassword = await hashPassword(input.defaultPassword || "Doctor@123");
      const userDoc: UserDocument = {
        name: input.name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: USER_ROLES.DOCTOR,
        phone: input.phone.trim(),
        avatar: "",
        status: "ACTIVE",
        createdAt: now,
        updatedAt: now,
      };
      const userResult = await users.insertOne(userDoc);
      userId = userResult.insertedId;
    } else {
      userId = user._id!;
      // Ensure user has DOCTOR role
      await users.updateOne({ _id: userId }, { $set: { role: USER_ROLES.DOCTOR, updatedAt: now } });
    }

    // Insert doctor document
    const doctorDoc: DoctorDocument = {
      userId,
      name: input.name.trim(),
      email: normalizedEmail,
      phone: input.phone.trim(),
      department: input.department.trim(),
      specialization: input.specialization.trim(),
      qualification: input.qualification.trim(),
      experienceYears: input.experienceYears,
      consultationFee: input.consultationFee,
      availableDays: input.availableDays,
      availableTime: input.availableTime,
      roomNumber: input.roomNumber.trim(),
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now,
    };

    const docResult = await doctors.insertOne(doctorDoc);
    doctorDoc._id = docResult.insertedId;

    return toSafeDoctor(doctorDoc);
  }

  public static async getAllDoctors(query: {
    department?: string;
    status?: string;
    search?: string;
  }): Promise<{ doctors: SafeDoctor[]; total: number }> {
    const doctors = getDoctorsCollection();
    const filter: any = {};

    if (query.department && query.department !== "All") {
      filter.department = query.department;
    }

    if (query.status) {
      filter.status = query.status;
    }

    if (query.search) {
      const regex = new RegExp(query.search.trim(), "i");
      filter.$or = [
        { name: regex },
        { specialization: regex },
        { department: regex },
        { qualification: regex },
      ];
    }

    const doctorDocs = await doctors.find(filter).sort({ createdAt: -1 }).toArray();

    return {
      doctors: doctorDocs.map((doc) => toSafeDoctor(doc)),
      total: doctorDocs.length,
    };
  }

  public static async getDoctorById(id: string): Promise<SafeDoctor> {
    if (!ObjectId.isValid(id)) {
      const error: any = new Error("Invalid doctor ID");
      error.statusCode = 400;
      throw error;
    }

    const doctors = getDoctorsCollection();
    const doctor = await doctors.findOne({ _id: new ObjectId(id) });
    if (!doctor) {
      const error: any = new Error("Doctor not found");
      error.statusCode = 404;
      throw error;
    }

    return toSafeDoctor(doctor);
  }

  public static async getDoctorByUserIdOrEmail(userId?: string, email?: string): Promise<SafeDoctor | null> {
    const doctors = getDoctorsCollection();
    const query: any = {};
    if (userId && ObjectId.isValid(userId)) {
      query.$or = [{ userId: new ObjectId(userId) }];
      if (email) query.$or.push({ email: email.toLowerCase() });
    } else if (email) {
      query.email = email.toLowerCase();
    } else {
      return null;
    }

    const doctor = await doctors.findOne(query);
    return doctor ? toSafeDoctor(doctor) : null;
  }

  public static async updateDoctor(id: string, input: UpdateDoctorInput): Promise<SafeDoctor> {
    if (!ObjectId.isValid(id)) {
      const error: any = new Error("Invalid doctor ID");
      error.statusCode = 400;
      throw error;
    }

    const doctors = getDoctorsCollection();
    const docId = new ObjectId(id);
    const existing = await doctors.findOne({ _id: docId });

    if (!existing) {
      const error: any = new Error("Doctor not found");
      error.statusCode = 404;
      throw error;
    }

    const updateFields: any = { ...input, updatedAt: new Date() };

    await doctors.updateOne({ _id: docId }, { $set: updateFields });
    const updated = await doctors.findOne({ _id: docId });

    return toSafeDoctor(updated!);
  }

  public static async deleteDoctor(id: string): Promise<void> {
    if (!ObjectId.isValid(id)) {
      const error: any = new Error("Invalid doctor ID");
      error.statusCode = 400;
      throw error;
    }

    const doctors = getDoctorsCollection();
    const docId = new ObjectId(id);
    const result = await doctors.deleteOne({ _id: docId });

    if (result.deletedCount === 0) {
      const error: any = new Error("Doctor not found");
      error.statusCode = 404;
      throw error;
    }
  }

  public static async getDepartments(): Promise<{ name: string; count: number }[]> {
    const doctors = getDoctorsCollection();
    const counts = await doctors
      .aggregate<{ _id: string; count: number }>([
        { $match: { status: "ACTIVE" } },
        { $group: { _id: "$department", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();

    return counts.map((item) => ({
      name: item._id,
      count: item.count,
    }));
  }
}
