import { connectDB, closeDB, getCollection } from "../config/db";
import type { DoctorDocument } from "../models/doctor.model";
import type { UserDocument } from "../models/user.model";

async function main() {
  console.log("=========================================");
  console.log("🏥 MediCore HMS: Doctor & User DB Seeder");
  console.log("=========================================");

  try {
    await connectDB();
    const usersCollection = getCollection<UserDocument>("users");
    const doctorsCollection = getCollection<DoctorDocument>("doctors");

    // 1. Update user account name from "Siam Ahmed" to "Dr. SM Siam" or "SM Siam"
    const updateResult = await usersCollection.updateMany(
      {
        $or: [
          { email: "dr.siam@medicore.com" },
          { name: { $regex: /siam ahmed/i } },
        ],
      },
      {
        $set: {
          name: "Dr. SM Siam",
          updatedAt: new Date(),
        },
      }
    );
    console.log(`[Users] Updated ${updateResult.modifiedCount} user record(s) to 'Dr. SM Siam'.`);

    // Also check if any patient user had Siam Ahmed
    await usersCollection.updateMany(
      { name: "Siam Ahmed" },
      { $set: { name: "SM Siam", updatedAt: new Date() } }
    );

    // 2. Remove all existing doctor records
    const deleteResult = await doctorsCollection.deleteMany({});
    console.log(`[Doctors] Removed ${deleteResult.deletedCount} old doctor records.`);

    // 3. Find Dr. SM Siam's userId if exists
    const doctorUser = await usersCollection.findOne({ email: "dr.siam@medicore.com" });

    // 4. Prepare exactly 1 top-tier specialist doctor for each hospital department
    const newDoctors: Omit<DoctorDocument, "_id">[] = [
      {
        userId: doctorUser?._id,
        name: "Dr. SM Siam",
        email: "dr.siam@medicore.com",
        phone: "+880 1711-100201",
        department: "Cardiology",
        specialization: "Interventional Cardiology & Coronary Angioplasty",
        qualification: "MBBS, FCPS (Cardiology), FACC (USA), Fellow Interventional Cardiology",
        experienceYears: 14,
        consultationFee: 1500,
        availableDays: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"],
        availableTime: { start: "05:00 PM", end: "09:00 PM" },
        roomNumber: "Chamber #402, Block B (4th Floor)",
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Dr. Nusrat Jahan",
        email: "dr.nusrat@medicore.com",
        phone: "+880 1711-100202",
        department: "Neurology",
        specialization: "Clinical Neurology, Stroke Care & Neuro-Rehabilitation",
        qualification: "MBBS, MD (Neurology), Fellow Acute Stroke Care (Singapore)",
        experienceYears: 12,
        consultationFee: 1400,
        availableDays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        availableTime: { start: "06:00 PM", end: "09:30 PM" },
        roomNumber: "Chamber #308, Block A (3rd Floor)",
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Dr. Tanvir Hasan",
        email: "dr.tanvir@medicore.com",
        phone: "+880 1711-100203",
        department: "Pediatrics",
        specialization: "Pediatric Intensive Care (PICU) & Neonatology (NICU)",
        qualification: "MBBS, DCH, FCPS (Pediatrics), Fellow Neonatal Medicine",
        experienceYears: 15,
        consultationFee: 1200,
        availableDays: ["Saturday", "Sunday", "Monday", "Wednesday", "Thursday"],
        availableTime: { start: "04:00 PM", end: "08:00 PM" },
        roomNumber: "Chamber #210, Block C (2nd Floor)",
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Dr. Ayesha Siddiqua",
        email: "dr.ayesha@medicore.com",
        phone: "+880 1711-100204",
        department: "Orthopedics",
        specialization: "Robotic Joint Replacement, Arthroscopy & Sports Medicine",
        qualification: "MBBS, MS (Orthopedics), Fellow Joint Reconstruction (UK)",
        experienceYears: 16,
        consultationFee: 1500,
        availableDays: ["Saturday", "Sunday", "Tuesday", "Wednesday"],
        availableTime: { start: "05:30 PM", end: "09:00 PM" },
        roomNumber: "Chamber #505, Block B (5th Floor)",
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Dr. Farzana Yasmin",
        email: "dr.farzana@medicore.com",
        phone: "+880 1711-100205",
        department: "Dermatology",
        specialization: "Clinical Dermatology, Laser Dermatosurgery & Allergy Clinic",
        qualification: "MBBS, DDV, FCPS (Dermatology), Fellow Laser & Cosmetology",
        experienceYears: 11,
        consultationFee: 1200,
        availableDays: ["Saturday", "Monday", "Wednesday", "Thursday"],
        availableTime: { start: "05:00 PM", end: "08:30 PM" },
        roomNumber: "Chamber #106, Block A (1st Floor)",
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Dr. Mahfuzur Rahman",
        email: "dr.mahfuz@medicore.com",
        phone: "+880 1711-100206",
        department: "General Medicine",
        specialization: "Internal Medicine, Diabetes & Chronic Disease Care",
        qualification: "MBBS, FCPS (Medicine), MRCP (UK), FACP (USA)",
        experienceYears: 18,
        consultationFee: 1300,
        availableDays: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        availableTime: { start: "04:30 PM", end: "08:30 PM" },
        roomNumber: "Chamber #202, Block A (2nd Floor)",
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Dr. Kazi Arifur Rahman",
        email: "dr.kazi.arif@medicore.com",
        phone: "+880 1711-100207",
        department: "General Surgery",
        specialization: "Advanced Laparoscopic, Hernia & Gastrointestinal Surgery",
        qualification: "MBBS, MS (Surgery), FACS (USA), Fellow Minimal Access Surgery",
        experienceYears: 17,
        consultationFee: 1400,
        availableDays: ["Saturday", "Sunday", "Monday", "Wednesday"],
        availableTime: { start: "06:00 PM", end: "09:00 PM" },
        roomNumber: "Chamber #315, Block B (3rd Floor)",
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Dr. Shamima Nasrin",
        email: "dr.shamima@medicore.com",
        phone: "+880 1711-100208",
        department: "Gynecology & Obstetrics",
        specialization: "High-Risk Pregnancy, Infertility Care & Laparoscopic Gynae",
        qualification: "MBBS, FCPS (Obs & Gynae), DGO, Fellow Infertility & IVF",
        experienceYears: 16,
        consultationFee: 1500,
        availableDays: ["Saturday", "Sunday", "Tuesday", "Thursday"],
        availableTime: { start: "05:00 PM", end: "09:00 PM" },
        roomNumber: "Chamber #412, Block C (4th Floor)",
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Dr. Zahidul Islam",
        email: "dr.zahid@medicore.com",
        phone: "+880 1711-100209",
        department: "Nephrology",
        specialization: "Renal Medicine, Hemodialysis & Kidney Transplant Follow-up",
        qualification: "MBBS, MD (Nephrology), Fellow Clinical Nephrology",
        experienceYears: 13,
        consultationFee: 1400,
        availableDays: ["Saturday", "Monday", "Tuesday", "Wednesday"],
        availableTime: { start: "05:30 PM", end: "08:30 PM" },
        roomNumber: "Chamber #518, Block A (5th Floor)",
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Dr. Rehana Parveen",
        email: "dr.rehana@medicore.com",
        phone: "+880 1711-100210",
        department: "Oncology",
        specialization: "Medical Oncology, Chemotherapy & Molecular Cancer Care",
        qualification: "MBBS, FCPS (Radiotherapy/Oncology), Fellow Tata Memorial Hospital",
        experienceYears: 15,
        consultationFee: 1600,
        availableDays: ["Sunday", "Monday", "Wednesday", "Thursday"],
        availableTime: { start: "05:00 PM", end: "08:30 PM" },
        roomNumber: "Chamber #602, Cancer Institute (6th Floor)",
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Dr. Mizanur Rahman",
        email: "dr.mizan@medicore.com",
        phone: "+880 1711-100211",
        department: "Gastroenterology",
        specialization: "Digestive Diseases, Hepatology & Therapeutic Endoscopy/Colonoscopy",
        qualification: "MBBS, MD (Gastroenterology), Fellow Endoscopic Surgery",
        experienceYears: 14,
        consultationFee: 1400,
        availableDays: ["Saturday", "Sunday", "Tuesday", "Wednesday"],
        availableTime: { start: "06:00 PM", end: "09:00 PM" },
        roomNumber: "Chamber #320, Block A (3rd Floor)",
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Dr. Shahriar Kabir",
        email: "dr.shahriar@medicore.com",
        phone: "+880 1711-100212",
        department: "Urology",
        specialization: "Endourology, Kidney Stones, Prostate Laser Surgery & Andrology",
        qualification: "MBBS, MS (Urology), Fellow Endourology",
        experienceYears: 13,
        consultationFee: 1400,
        availableDays: ["Sunday", "Monday", "Tuesday", "Thursday"],
        availableTime: { start: "05:30 PM", end: "09:00 PM" },
        roomNumber: "Chamber #425, Block B (4th Floor)",
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Dr. Anisur Rahman",
        email: "dr.anisur@medicore.com",
        phone: "+880 1711-100213",
        department: "Ophthalmology",
        specialization: "Micro-Incision Phaco Cataract Surgery & Vitreo-Retinal Care",
        qualification: "MBBS, FCPS (Ophthalmology), Fellow LVPEI",
        experienceYears: 16,
        consultationFee: 1200,
        availableDays: ["Saturday", "Monday", "Wednesday", "Thursday"],
        availableTime: { start: "04:30 PM", end: "08:00 PM" },
        roomNumber: "Chamber #115, Eye Institute (1st Floor)",
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Dr. Nazmul Karim",
        email: "dr.nazmul@medicore.com",
        phone: "+880 1711-100214",
        department: "ENT (Ear, Nose, Throat)",
        specialization: "Endoscopic Sinus Surgery, Micro-Ear Surgery & Head-Neck Clinic",
        qualification: "MBBS, DLO, FCPS (ENT), Fellow Rhinology",
        experienceYears: 15,
        consultationFee: 1200,
        availableDays: ["Sunday", "Monday", "Wednesday", "Thursday"],
        availableTime: { start: "05:00 PM", end: "08:30 PM" },
        roomNumber: "Chamber #225, Block C (2nd Floor)",
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Dr. Sabrina Haque",
        email: "dr.sabrina@medicore.com",
        phone: "+880 1711-100215",
        department: "Psychiatry",
        specialization: "Neuropsychiatry, Adult & Child Mental Health & Counseling",
        qualification: "MBBS, MPhil (Psychiatry), Member World Psychiatric Association",
        experienceYears: 12,
        consultationFee: 1300,
        availableDays: ["Saturday", "Tuesday", "Wednesday", "Thursday"],
        availableTime: { start: "05:00 PM", end: "08:30 PM" },
        roomNumber: "Chamber #610, Block A (6th Floor)",
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const insertResult = await doctorsCollection.insertMany(newDoctors);
    console.log(`[Doctors] Successfully seeded ${insertResult.insertedCount} specialist doctors (1 for each hospital department)!`);

    console.log("=========================================");
    console.log("✅ Database seeding completed successfully!");
    console.log("=========================================");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await closeDB();
  }
}

main();
