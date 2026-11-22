import { Request, Response, NextFunction } from "express";
import { LabReportService } from "../services/labReport.service";
import { LabReportStatus } from "../models/labReport.model";

export class LabReportController {
  public static async createReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const report = await LabReportService.createReport(req.body);

      res.status(201).json({
        success: true,
        message: `Diagnostic report ${report.reportNumber} created successfully!`,
        data: { report },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const report = await LabReportService.getReportById(id);

      res.status(200).json({
        success: true,
        data: { report },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getMyReports(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const patientUserId = (req as any).user?.id;
      const phone = typeof req.query.phone === "string" ? req.query.phone : (req as any).user?.phone;

      const reports = await LabReportService.getReportsByPatient({
        patientId: patientUserId,
        patientPhone: phone,
      });

      res.status(200).json({
        success: true,
        data: { reports },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getDoctorReports(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const doctorId = req.params.doctorId as string;
      const reports = await LabReportService.getReportsByDoctor(doctorId);

      res.status(200).json({
        success: true,
        data: { reports },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getAllReports(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const search = typeof req.query.search === "string" ? req.query.search : undefined;
      const category = typeof req.query.category === "string" ? req.query.category : undefined;
      const status = typeof req.query.status === "string" ? req.query.status : undefined;

      const reports = await LabReportService.getAllReports({ search, category, status });

      res.status(200).json({
        success: true,
        data: { reports },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const status = req.body.status as LabReportStatus;

      const report = await LabReportService.updateStatus(id, status);

      res.status(200).json({
        success: true,
        message: `Diagnostic report status updated to ${status}`,
        data: { report },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const success = await LabReportService.deleteReport(id);

      res.status(200).json({
        success,
        message: "Diagnostic report deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
