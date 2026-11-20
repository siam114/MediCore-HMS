import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export function validate(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues || (error as any).errors || [];
        const formattedErrors = issues.map((err: any) => ({
          field: Array.isArray(err.path) ? err.path.join(".") : String(err.path),
          message: err.message,
        }));
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: formattedErrors,
        });
        return;
      }
      next(error);
    }
  };
}
