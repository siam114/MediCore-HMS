import { Request, Response, NextFunction } from "express";
import { BillingService } from "../services/billing.service";
import { PaymentStatus } from "../models/billing.model";

export class BillingController {
  public static async createInvoice(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const invoice = await BillingService.createInvoice(req.body);

      res.status(201).json({
        success: true,
        message: `Hospital invoice ${invoice.invoiceNumber} created successfully!`,
        data: { invoice },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getAllInvoices(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const search = typeof req.query.search === "string" ? req.query.search : undefined;
      const status = typeof req.query.status === "string" ? (req.query.status as PaymentStatus) : undefined;
      const patientId = typeof req.query.patientId === "string" ? req.query.patientId : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : 50;
      const skip = req.query.skip ? Number(req.query.skip) : 0;

      const result = await BillingService.getAllInvoices({
        search,
        status,
        patientId,
        limit,
        skip,
      });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const invoice = await BillingService.getInvoiceById(id);

      if (!invoice) {
        res.status(404).json({
          success: false,
          message: "Invoice not found.",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: { invoice },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async recordPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const updated = await BillingService.recordPayment(id, req.body);

      if (!updated) {
        res.status(404).json({
          success: false,
          message: "Invoice not found.",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: `Payment of BDT ${req.body.additionalPaid} recorded successfully.`,
        data: { invoice: updated },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteInvoice(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const deleted = await BillingService.deleteInvoice(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: "Invoice not found or already deleted.",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Invoice deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await BillingService.getBillingStats();
      res.status(200).json({
        success: true,
        data: { stats },
      });
    } catch (error) {
      next(error);
    }
  }
}
