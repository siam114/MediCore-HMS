import { ObjectId, Filter } from "mongodb";
import {
  getBillingCollection,
  BillingDocument,
  SafeBilling,
  toSafeBilling,
  PaymentStatus,
} from "../models/billing.model";
import { CreateBillingInput, RecordPaymentInput } from "../validations/billing.validation";

export class BillingService {
  /**
   * Create an official hospital invoice / money receipt
   */
  public static async createInvoice(input: CreateBillingInput): Promise<SafeBilling> {
    const billings = getBillingCollection();

    // Generate unique invoice number: e.g. INV-261123-001
    const today = new Date();
    const dateFormatted = today.toISOString().split("T")[0].replace(/-/g, "").slice(2);
    const countToday = await billings.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    });

    const indexFormatted = String(countToday + 1).padStart(3, "0");
    const invoiceNumber = `INV-${dateFormatted}-${indexFormatted}`;

    // Calculate subtotal from items if not provided accurately
    const items = input.items.map((it) => ({
      ...it,
      total: it.quantity * it.unitPrice,
    }));
    const subTotal = items.reduce((sum, it) => sum + it.total, 0);
    const discount = Number(input.discount) || 0;
    const tax = Number(input.tax) || 0;
    const grandTotal = Math.max(0, subTotal - discount + tax);
    const paidAmount = Number(input.paidAmount) || 0;
    const dueAmount = Math.max(0, grandTotal - paidAmount);

    let paymentStatus: PaymentStatus = "UNPAID";
    if (dueAmount === 0 && grandTotal > 0) {
      paymentStatus = "PAID";
    } else if (paidAmount > 0 && dueAmount > 0) {
      paymentStatus = "PARTIAL";
    }

    const now = new Date();
    const doc: BillingDocument = {
      invoiceNumber,
      patientId: input.patientId && ObjectId.isValid(input.patientId) ? new ObjectId(input.patientId) : undefined,
      patientName: input.patientName.trim(),
      patientPhone: input.patientPhone.trim(),
      patientAge: input.patientAge ? Number(input.patientAge) : undefined,
      patientGender: input.patientGender,
      patientAddress: input.patientAddress?.trim() || "",
      referredDoctorId: input.referredDoctorId && ObjectId.isValid(input.referredDoctorId) ? new ObjectId(input.referredDoctorId) : undefined,
      referredDoctorName: input.referredDoctorName?.trim() || "Dr. SM Siam",
      appointmentId: input.appointmentId && ObjectId.isValid(input.appointmentId) ? new ObjectId(input.appointmentId) : undefined,
      items,
      subTotal,
      discount,
      tax,
      grandTotal,
      paidAmount,
      dueAmount,
      paymentStatus,
      paymentMethod: input.paymentMethod,
      transactionId: input.transactionId?.trim() || "",
      notes: input.notes?.trim() || "",
      issuedBy: input.issuedBy?.trim() || "Accounts Desk (MediCore HMS)",
      billingDate: input.billingDate ? new Date(input.billingDate) : now,
      createdAt: now,
      updatedAt: now,
    };

    const result = await billings.insertOne(doc);
    doc._id = result.insertedId;

    return toSafeBilling(doc);
  }

  /**
   * Get all hospital invoices with optional filters and search
   */
  public static async getAllInvoices(query: {
    search?: string;
    status?: PaymentStatus;
    patientId?: string;
    limit?: number;
    skip?: number;
  }): Promise<{ invoices: SafeBilling[]; total: number }> {
    const billings = getBillingCollection();
    const filter: Filter<BillingDocument> = {};

    if (query.status) {
      filter.paymentStatus = query.status;
    }

    if (query.patientId && ObjectId.isValid(query.patientId)) {
      filter.patientId = new ObjectId(query.patientId);
    }

    if (query.search) {
      const searchRegex = new RegExp(query.search.trim(), "i");
      filter.$or = [
        { invoiceNumber: searchRegex },
        { patientName: searchRegex },
        { patientPhone: searchRegex },
        { referredDoctorName: searchRegex },
      ];
    }

    const limit = query.limit || 50;
    const skip = query.skip || 0;

    const [docs, total] = await Promise.all([
      billings.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      billings.countDocuments(filter),
    ]);

    return {
      invoices: docs.map(toSafeBilling),
      total,
    };
  }

  /**
   * Get single invoice by ID or Invoice Number
   */
  public static async getInvoiceById(idOrNumber: string): Promise<SafeBilling | null> {
    const billings = getBillingCollection();

    let doc: BillingDocument | null = null;
    if (ObjectId.isValid(idOrNumber)) {
      doc = await billings.findOne({ _id: new ObjectId(idOrNumber) });
    }

    if (!doc) {
      doc = await billings.findOne({ invoiceNumber: idOrNumber.trim() });
    }

    return doc ? toSafeBilling(doc) : null;
  }

  /**
   * Record an additional payment toward an invoice
   */
  public static async recordPayment(
    id: string,
    input: RecordPaymentInput
  ): Promise<SafeBilling | null> {
    const billings = getBillingCollection();
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const doc = await billings.findOne({ _id: new ObjectId(id) });
    if (!doc) {
      return null;
    }

    const newPaidAmount = doc.paidAmount + Number(input.additionalPaid);
    const newDueAmount = Math.max(0, doc.grandTotal - newPaidAmount);

    let newStatus: PaymentStatus = "UNPAID";
    if (newDueAmount === 0 && doc.grandTotal > 0) {
      newStatus = "PAID";
    } else if (newPaidAmount > 0) {
      newStatus = "PARTIAL";
    }

    const now = new Date();
    await billings.updateOne(
      { _id: doc._id },
      {
        $set: {
          paidAmount: newPaidAmount,
          dueAmount: newDueAmount,
          paymentStatus: newStatus,
          paymentMethod: input.paymentMethod,
          transactionId: input.transactionId?.trim() || doc.transactionId,
          updatedAt: now,
        },
      }
    );

    const updated = await billings.findOne({ _id: doc._id });
    return updated ? toSafeBilling(updated) : null;
  }

  /**
   * Delete an invoice (Admin only)
   */
  public static async deleteInvoice(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const billings = getBillingCollection();
    const result = await billings.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  /**
   * Get revenue and billing statistics summary
   */
  public static async getBillingStats(): Promise<{
    totalInvoiced: number;
    totalCollected: number;
    totalDue: number;
    todayCollection: number;
    paidCount: number;
    partialCount: number;
    unpaidCount: number;
    totalInvoices: number;
  }> {
    const billings = getBillingCollection();
    const all = await billings.find({}).toArray();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    let totalInvoiced = 0;
    let totalCollected = 0;
    let totalDue = 0;
    let todayCollection = 0;
    let paidCount = 0;
    let partialCount = 0;
    let unpaidCount = 0;

    for (const b of all) {
      totalInvoiced += b.grandTotal || 0;
      totalCollected += b.paidAmount || 0;
      totalDue += b.dueAmount || 0;

      if (b.paymentStatus === "PAID") paidCount++;
      else if (b.paymentStatus === "PARTIAL") partialCount++;
      else unpaidCount++;

      if (new Date(b.createdAt) >= startOfToday) {
        todayCollection += b.paidAmount || 0;
      }
    }

    return {
      totalInvoiced,
      totalCollected,
      totalDue,
      todayCollection,
      paidCount,
      partialCount,
      unpaidCount,
      totalInvoices: all.length,
    };
  }
}
