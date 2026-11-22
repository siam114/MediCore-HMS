import { Request, Response, NextFunction } from "express";
import { AppointmentService } from "../services/appointment.service";
import { AppointmentStatus, PaymentStatus } from "../models/appointment.model";

export class AppointmentController {
  public static async createAppointment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const patientUserId = (req as any).user?.id;
      const appointment = await AppointmentService.createAppointment(req.body, patientUserId);

      res.status(201).json({
        success: true,
        message: `Appointment confirmed successfully! Your Serial Token is ${appointment.serialNumber}`,
        data: { appointment },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getMyPatientAppointments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const patientUserId = (req as any).user?.id;
      const phone = typeof req.query.phone === "string" ? req.query.phone : undefined;

      const appointments = await AppointmentService.getPatientAppointments(patientUserId, phone);
      res.status(200).json({
        success: true,
        data: { appointments },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getDoctorAppointments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const doctorId = req.params.doctorId as string;
      const date = typeof req.query.date === "string" ? req.query.date : undefined;

      const appointments = await AppointmentService.getDoctorAppointments(doctorId, date);
      res.status(200).json({
        success: true,
        data: { appointments },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getAllAppointments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { date, status, department } = req.query;
      const result = await AppointmentService.getAllAppointments({
        date: typeof date === "string" ? date : undefined,
        status: typeof status === "string" ? status : undefined,
        department: typeof department === "string" ? department : undefined,
      });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const { status, paymentStatus } = req.body;

      const updated = await AppointmentService.updateAppointmentStatus(
        id,
        status as AppointmentStatus,
        paymentStatus as PaymentStatus | undefined
      );

      res.status(200).json({
        success: true,
        message: "Appointment status updated successfully",
        data: { appointment: updated },
      });
    } catch (error) {
      next(error);
    }
  }
}
