import { Request, Response, NextFunction } from "express";
import { DoctorService } from "../services/doctor.service";

export class DoctorController {
  public static async createDoctor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const doctor = await DoctorService.createDoctor(req.body);
      res.status(201).json({
        success: true,
        message: "Doctor profile created successfully with portal login credentials",
        data: { doctor },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getAllDoctors(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { department, status, search } = req.query;
      const result = await DoctorService.getAllDoctors({
        department: typeof department === "string" ? department : undefined,
        status: typeof status === "string" ? status : undefined,
        search: typeof search === "string" ? search : undefined,
      });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getDoctorById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const doctor = await DoctorService.getDoctorById(req.params.id as string);
      res.status(200).json({
        success: true,
        data: { doctor },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateDoctor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const doctor = await DoctorService.updateDoctor(req.params.id as string, req.body);
      res.status(200).json({
        success: true,
        message: "Doctor profile updated successfully",
        data: { doctor },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteDoctor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await DoctorService.deleteDoctor(req.params.id as string);
      res.status(200).json({
        success: true,
        message: "Doctor profile removed successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getDepartments(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const departments = await DoctorService.getDepartments();
      res.status(200).json({
        success: true,
        data: { departments },
      });
    } catch (error) {
      next(error);
    }
  }
}
