import { Request, Response, NextFunction } from "express";
import { PrescriptionService } from "../services/prescription.service";

export class PrescriptionController {
  public static async createPrescription(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const prescription = await PrescriptionService.createPrescription(req.body);

      res.status(201).json({
        success: true,
        message: `Prescription ${prescription.prescriptionNumber} generated successfully!`,
        data: { prescription },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const prescription = await PrescriptionService.getById(id);

      if (!prescription) {
        res.status(404).json({
          success: false,
          message: "Prescription not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: { prescription },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getDoctorPrescriptions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const doctorId = req.params.doctorId as string;
      const prescriptions = await PrescriptionService.getByDoctor(doctorId);

      res.status(200).json({
        success: true,
        data: { prescriptions },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getMyPatientPrescriptions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const patientUserId = (req as any).user?.id;
      const phone = typeof req.query.phone === "string" ? req.query.phone : undefined;

      const prescriptions = await PrescriptionService.getByPatient(patientUserId, phone);

      res.status(200).json({
        success: true,
        data: { prescriptions },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getAllPrescriptions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const department = typeof req.query.department === "string" ? req.query.department : undefined;
      const prescriptions = await PrescriptionService.getAll(department);

      res.status(200).json({
        success: true,
        data: { prescriptions },
      });
    } catch (error) {
      next(error);
    }
  }
}
