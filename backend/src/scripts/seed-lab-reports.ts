import { connectDB, closeDB, getCollection } from "../config/db";
import type { LabReportDocument } from "../models/labReport.model";
import type { DoctorDocument } from "../models/doctor.model";
import type { UserDocument } from "../models/user.model";

async function main() {
  console.log("==================================================");
  console.log("🧪 MediCore HMS: Diagnostic Lab Reports DB Seeder");
  console.log("==================================================");

  try {
    await connectDB();
    const labReportsCollection = getCollection<LabReportDocument>("lab_reports");
    const doctorsCollection = getCollection<DoctorDocument>("doctors");
    const usersCollection = getCollection<UserDocument>("users");

    // Clear old lab reports
    await labReportsCollection.deleteMany({});
    console.log("[Lab Reports] Cleared existing lab reports.");

    // Find Dr. SM Siam
    const drSiam = await doctorsCollection.findOne({ name: { $regex: /siam/i } });
    const patientUser = await usersCollection.findOne({ email: "siam.patient@gmail.com" });

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0].replace(/-/g, "").slice(2);

    const sampleReports: Omit<LabReportDocument, "_id">[] = [
      {
        reportNumber: `LAB-${todayStr}-001`,
        testName: "Complete Blood Count (CBC) with ESR",
        category: "HEMATOLOGY",
        sampleType: "Whole Blood (EDTA)",
        patientId: patientUser?._id,
        patientName: "SM Siam",
        patientPhone: "01567898506",
        patientAge: 32,
        patientGender: "MALE",
        referredDoctorId: drSiam?._id,
        referredDoctorName: drSiam?.name || "Dr. SM Siam",
        parameters: [
          { name: "Hemoglobin (Hb)", value: "14.8", unit: "g/dL", referenceRange: "13.0 - 17.5", isAbnormal: false },
          { name: "Total RBC Count", value: "4.9", unit: "x10^12/L", referenceRange: "4.5 - 5.9", isAbnormal: false },
          { name: "Total WBC Count", value: "7,400", unit: "/cumm", referenceRange: "4,000 - 11,000", isAbnormal: false },
          { name: "Platelet Count", value: "245,000", unit: "/cumm", referenceRange: "150,000 - 450,000", isAbnormal: false },
          { name: "Packed Cell Volume (PCV)", value: "44.2", unit: "%", referenceRange: "40.0 - 52.0", isAbnormal: false },
          { name: "ESR (Westergren)", value: "12", unit: "mm/1st hr", referenceRange: "0 - 15", isAbnormal: false },
          { name: "Neutrophils", value: "62", unit: "%", referenceRange: "40 - 75", isAbnormal: false },
          { name: "Lymphocytes", value: "30", unit: "%", referenceRange: "20 - 45", isAbnormal: false },
        ],
        clinicalImpression: "Hematological profile is within normal adult physiological parameters. No cytopenia or leukocytosis noted.",
        performedBy: "Md. Rafiqul Islam, Senior Medical Technologist (Lab)",
        verifiedBy: "Prof. Dr. M. A. Jalil, MBBS, FCPS (Pathology), Chief Consultant Pathologist",
        status: "COMPLETED",
        sampleCollectedAt: new Date(Date.now() - 3600000 * 4),
        reportDeliveredAt: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        reportNumber: `LAB-${todayStr}-002`,
        testName: "Lipid Profile (Fasting)",
        category: "BIOCHEMISTRY",
        sampleType: "Blood Serum",
        patientId: patientUser?._id,
        patientName: "SM Siam",
        patientPhone: "01567898506",
        patientAge: 32,
        patientGender: "MALE",
        referredDoctorId: drSiam?._id,
        referredDoctorName: drSiam?.name || "Dr. SM Siam",
        parameters: [
          { name: "Total Cholesterol", value: "182", unit: "mg/dL", referenceRange: "< 200", isAbnormal: false },
          { name: "HDL Cholesterol", value: "48", unit: "mg/dL", referenceRange: "> 40", isAbnormal: false },
          { name: "LDL Cholesterol", value: "112", unit: "mg/dL", referenceRange: "< 100", isAbnormal: true },
          { name: "Triglycerides", value: "140", unit: "mg/dL", referenceRange: "< 150", isAbnormal: false },
          { name: "Cholesterol / HDL Ratio", value: "3.79", unit: "ratio", referenceRange: "< 4.5", isAbnormal: false },
        ],
        clinicalImpression: "Borderline elevated LDL Cholesterol. Dietary lifestyle modifications recommended with regular aerobic exercise.",
        performedBy: "Kazi Farhana, Medical Technologist (Biochemistry)",
        verifiedBy: "Dr. Shahriar Kabir, MBBS, MD (Biochemistry), Consultant Biochemist",
        status: "COMPLETED",
        sampleCollectedAt: new Date(Date.now() - 3600000 * 6),
        reportDeliveredAt: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        reportNumber: `LAB-${todayStr}-003`,
        testName: "High Sensitivity Cardiac Troponin-I (hs-cTnI)",
        category: "CARDIOLOGY",
        sampleType: "Heparinized Plasma",
        patientId: patientUser?._id,
        patientName: "SM Siam",
        patientPhone: "01567898506",
        patientAge: 32,
        patientGender: "MALE",
        referredDoctorId: drSiam?._id,
        referredDoctorName: drSiam?.name || "Dr. SM Siam",
        parameters: [
          { name: "hs-cTnI Quantitative", value: "4.2", unit: "pg/mL", referenceRange: "< 19.8", isAbnormal: false },
          { name: "Serum Creatine Kinase (CK-MB)", value: "16", unit: "U/L", referenceRange: "< 25", isAbnormal: false },
        ],
        clinicalImpression: "Negative for acute myocardial ischemic injury. Biomarkers are within reassuring reference threshold.",
        performedBy: "Md. Monir Hossain, Lab Specialist (Cardiac Diagnostics)",
        verifiedBy: "Dr. SM Siam, MBBS, FCPS (Cardiology), FACC (USA)",
        status: "DELIVERED",
        sampleCollectedAt: new Date(Date.now() - 3600000 * 24),
        reportDeliveredAt: new Date(Date.now() - 3600000 * 20),
        createdAt: new Date(Date.now() - 3600000 * 24),
        updatedAt: new Date(Date.now() - 3600000 * 20),
      },
    ];

    const result = await labReportsCollection.insertMany(sampleReports);
    console.log(`[Lab Reports] Successfully seeded ${result.insertedCount} authentic diagnostic reports!`);
    console.log("==================================================");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await closeDB();
  }
}

main();
