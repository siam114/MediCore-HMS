import { apiClient } from "./client";
import type { ApiResponse } from "@/types";
import type {
  BillingInvoice,
  CreateInvoicePayload,
  BillingStatsSummary,
  PaymentStatus,
  PaymentMethod,
} from "@/types/billing";

export const billingService = {
  async create(data: CreateInvoicePayload): Promise<ApiResponse<{ invoice: BillingInvoice }>> {
    return apiClient.post<{ invoice: BillingInvoice }>("/billing", data);
  },

  async getById(idOrNumber: string): Promise<ApiResponse<{ invoice: BillingInvoice }>> {
    return apiClient.get<{ invoice: BillingInvoice }>(`/billing/${idOrNumber}`);
  },

  async getAll(params?: {
    search?: string;
    status?: PaymentStatus;
    patientId?: string;
    limit?: number;
    skip?: number;
  }): Promise<ApiResponse<{ invoices: BillingInvoice[]; total: number }>> {
    return apiClient.get<{ invoices: BillingInvoice[]; total: number }>("/billing", {
      params,
    });
  },

  async recordPayment(
    id: string,
    data: {
      additionalPaid: number;
      paymentMethod: PaymentMethod;
      transactionId?: string;
    }
  ): Promise<ApiResponse<{ invoice: BillingInvoice }>> {
    return apiClient.patch<{ invoice: BillingInvoice }>(`/billing/${id}/payment`, data);
  },

  async getStats(): Promise<ApiResponse<{ stats: BillingStatsSummary }>> {
    return apiClient.get<{ stats: BillingStatsSummary }>("/billing/stats/summary");
  },

  async delete(id: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<{ message: string }>(`/billing/${id}`);
  },
};
