import { Router } from "express";
import { BillingController } from "../controllers/billing.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  createBillingSchema,
  recordPaymentSchema,
} from "../validations/billing.validation";
import { authenticate, authorize, optionalAuthenticate } from "../middlewares/auth.middleware";
import { USER_ROLES } from "../constants/roles";

const router = Router();

// Create new hospital invoice / cash memo (Staff, Admin, Doctor)
router.post(
  "/",
  authenticate,
  authorize(USER_ROLES.STAFF, USER_ROLES.ADMIN, USER_ROLES.DOCTOR),
  validate(createBillingSchema),
  BillingController.createInvoice
);

// Revenue & Billing stats summary
router.get(
  "/stats/summary",
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.STAFF),
  BillingController.getStats
);

// Get single invoice by ID or Invoice Number (Patient, Staff, Admin)
router.get("/:id", optionalAuthenticate, BillingController.getById);

// Get all invoices with search and filters (Staff, Admin, Doctor)
router.get(
  "/",
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.STAFF, USER_ROLES.DOCTOR),
  BillingController.getAllInvoices
);

// Record additional payment on due invoice (Staff, Admin)
router.patch(
  "/:id/payment",
  authenticate,
  authorize(USER_ROLES.STAFF, USER_ROLES.ADMIN),
  validate(recordPaymentSchema),
  BillingController.recordPayment
);

// Delete an invoice (Admin only)
router.delete(
  "/:id",
  authenticate,
  authorize(USER_ROLES.ADMIN),
  BillingController.deleteInvoice
);

export default router;
