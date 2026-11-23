import { connectDB, closeDB, getCollection } from "../config/db";
import type { BillingDocument } from "../models/billing.model";
import type { DoctorDocument } from "../models/doctor.model";
import type { UserDocument } from "../models/user.model";

async function main() {
  console.log("==================================================");
  console.log("💳 MediCore HMS: Hospital Billing & Invoicing Seeder");
  console.log("==================================================");

  try {
    await connectDB();
    const billingCollection = getCollection<BillingDocument>("billings");
    const doctorsCollection = getCollection<DoctorDocument>("doctors");
    const usersCollection = getCollection<UserDocument>("users");

    // Clear old billing records
    await billingCollection.deleteMany({});
    console.log("[Billing] Cleared existing invoice records.");

    // Find Dr. SM Siam
    const drSiam = await doctorsCollection.findOne({ name: { $regex: /siam/i } });
    const patientUser = await usersCollection.findOne({ email: "siam.patient@gmail.com" });

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0].replace(/-/g, "").slice(2);

    const sampleInvoices: Omit<BillingDocument, "_id">[] = [
      {
        invoiceNumber: `INV-${todayStr}-001`,
        patientId: patientUser?._id,
        patientName: "SM Siam",
        patientPhone: "01567898506",
        patientAge: 32,
        patientGender: "MALE",
        patientAddress: "House 24, Road 7, Dhanmondi, Dhaka",
        referredDoctorId: drSiam?._id,
        referredDoctorName: drSiam?.name || "Dr. SM Siam",
        items: [
          {
            description: "Consultation - Dr. SM Siam (Interventional Cardiology)",
            category: "CONSULTATION",
            quantity: 1,
            unitPrice: 1200,
            total: 1200,
          },
          {
            description: "Complete Blood Count (CBC) with ESR",
            category: "LAB_TEST",
            quantity: 1,
            unitPrice: 600,
            total: 600,
          },
          {
            description: "12-Lead Electrocardiogram (ECG)",
            category: "PROCEDURE",
            quantity: 1,
            unitPrice: 500,
            total: 500,
          },
        ],
        subTotal: 2300,
        discount: 200,
        tax: 0,
        grandTotal: 2100,
        paidAmount: 2100,
        dueAmount: 0,
        paymentStatus: "PAID",
        paymentMethod: "BKASH",
        transactionId: "TRX88492019BK",
        notes: "OPD Regular Consultation & Cardiology Baseline Screening. Full payment cleared.",
        issuedBy: "Md. Tanvir Hossain (Accounts Officer)",
        billingDate: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        invoiceNumber: `INV-${todayStr}-002`,
        patientName: "Begum Rokeya Sultana",
        patientPhone: "01712345678",
        patientAge: 58,
        patientGender: "FEMALE",
        patientAddress: "Mirpur DOHS, Dhaka",
        referredDoctorId: drSiam?._id,
        referredDoctorName: drSiam?.name || "Dr. SM Siam",
        items: [
          {
            description: "Cardiac Troponin-I (High Sensitivity Quantitative)",
            category: "LAB_TEST",
            quantity: 1,
            unitPrice: 1800,
            total: 1800,
          },
          {
            description: "Lipid Profile (Cholesterol, HDL, LDL, Triglycerides)",
            category: "LAB_TEST",
            quantity: 1,
            unitPrice: 1100,
            total: 1100,
          },
          {
            description: "Fasting Blood Sugar (FBS)",
            category: "LAB_TEST",
            quantity: 1,
            unitPrice: 200,
            total: 200,
          },
        ],
        subTotal: 3100,
        discount: 300,
        tax: 0,
        grandTotal: 2800,
        paidAmount: 2800,
        dueAmount: 0,
        paymentStatus: "PAID",
        paymentMethod: "CASH",
        transactionId: "CASH-REC-0092",
        notes: "Pathology package discount applied. Blood samples received at central pathology.",
        issuedBy: "Accounts Desk (MediCore HMS)",
        billingDate: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        invoiceNumber: `INV-${todayStr}-003`,
        patientName: "Mohammad Jahangir Alam",
        patientPhone: "01819876543",
        patientAge: 46,
        patientGender: "MALE",
        patientAddress: "Sector 4, Uttara, Dhaka",
        referredDoctorName: "Dr. Farhana Ahmed",
        items: [
          {
            description: "Deluxe Cabin Inpatient Admission (2 Days)",
            category: "ADMISSION_BED",
            quantity: 2,
            unitPrice: 3500,
            total: 7000,
          },
          {
            description: "Hospital Medical & Nursing Care Service",
            category: "PROCEDURE",
            quantity: 2,
            unitPrice: 800,
            total: 1600,
          },
          {
            description: "Inpatient Pharmacy Medicines & IV Fluids",
            category: "PHARMACY",
            quantity: 1,
            unitPrice: 2450,
            total: 2450,
          },
        ],
        subTotal: 11050,
        discount: 550,
        tax: 0,
        grandTotal: 10500,
        paidAmount: 6000,
        dueAmount: 4500,
        paymentStatus: "PARTIAL",
        paymentMethod: "CARD",
        transactionId: "VISA-AUTH-492049",
        notes: "Admission advance paid. Remaining BDT 4,500 due at the time of discharge.",
        issuedBy: "IPD Billing Counter (MediCore HMS)",
        billingDate: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        invoiceNumber: `INV-${todayStr}-004`,
        patientName: "Anika Tabassum",
        patientPhone: "01998765432",
        patientAge: 24,
        patientGender: "FEMALE",
        patientAddress: "Mohakhali, Dhaka",
        referredDoctorName: "Emergency Medical Officer",
        items: [
          {
            description: "Emergency Room Triage & Medical Care",
            category: "PROCEDURE",
            quantity: 1,
            unitPrice: 800,
            total: 800,
          },
          {
            description: "Sterile Wound Dressing & Antiseptic Care",
            category: "PROCEDURE",
            quantity: 1,
            unitPrice: 400,
            total: 400,
          },
          {
            description: "Tetanus Toxoid Vaccine (0.5ml IM)",
            category: "PHARMACY",
            quantity: 1,
            unitPrice: 150,
            total: 150,
          },
        ],
        subTotal: 1350,
        discount: 0,
        tax: 0,
        grandTotal: 1350,
        paidAmount: 1350,
        dueAmount: 0,
        paymentStatus: "PAID",
        paymentMethod: "NAGAD",
        transactionId: "NAGAD-98234821",
        notes: "Emergency department immediate payment. Patient cleared for discharge.",
        issuedBy: "Emergency Desk (MediCore HMS)",
        billingDate: now,
        createdAt: now,
        updatedAt: now,
      },
    ];

    const result = await billingCollection.insertMany(sampleInvoices as BillingDocument[]);
    console.log(`[Billing] Successfully seeded ${result.insertedCount} hospital billing invoices!`);
  } catch (error) {
    console.error("[Billing Seeder Error]:", error);
  } finally {
    await closeDB();
    console.log("[DB] Connection closed cleanly.");
  }
}

main();
