import { ObjectId, Collection } from "mongodb";
import { getCollection } from "../config/db";

export interface DoctorDocument {
  _id?: ObjectId;
  userId?: ObjectId;
  name: string;
  email: string;
  phone: string;
  department: string;
  specialization: string;
  qualification: string;
  experienceYears: number;
  consultationFee: number;
  availableDays: string[];
  availableTime: {
    start: string;
    end: string;
  };
  roomNumber: string;
  status: "ACTIVE" | "INACTIVE" | "ON_LEAVE";
  createdAt: Date;
  updatedAt: Date;
}

export interface SafeDoctor {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  specialization: string;
  qualification: string;
  experienceYears: number;
  consultationFee: number;
  availableDays: string[];
  availableTime: {
    start: string;
    end: string;
  };
  roomNumber: string;
  status: "ACTIVE" | "INACTIVE" | "ON_LEAVE";
  createdAt: Date;
  updatedAt: Date;
}

export function getDoctorsCollection(): Collection<DoctorDocument> {
  return getCollection<DoctorDocument>("doctors");
}

export function toSafeDoctor(doc: DoctorDocument): SafeDoctor {
  return {
    id: doc._id ? doc._id.toString() : "",
    userId: doc.userId ? doc.userId.toString() : undefined,
    name: doc.name,
    email: doc.email,
    phone: doc.phone,
    department: doc.department,
    specialization: doc.specialization,
    qualification: doc.qualification,
    experienceYears: doc.experienceYears,
    consultationFee: doc.consultationFee,
    availableDays: doc.availableDays || [],
    availableTime: doc.availableTime || { start: "09:00 AM", end: "05:00 PM" },
    roomNumber: doc.roomNumber || "",
    status: doc.status || "ACTIVE",
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}
