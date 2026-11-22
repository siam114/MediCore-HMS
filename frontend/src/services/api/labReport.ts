import { apiClient } from "./client";
import type { ApiResponse } from "@/types";
import type { LabReport, CreateLabReportPayload, LabReportStatus } from "@/types/labReport";

export const labReportService = {
  async create(data: CreateLabReportPayload): Promise<ApiResponse<{ report: LabReport }>> {
    return apiClient.post<{ report: LabReport }>("/lab-reports", data);
  },

  async getById(id: string): Promise<ApiResponse<{ report: LabReport }>> {
    return apiClient.get<{ report: LabReport }>(`/lab-reports/${id}`);
  },

  async getMy(phone?: string): Promise<ApiResponse<{ reports: LabReport[] }>> {
    return apiClient.get<{ reports: LabReport[] }>("/lab-reports/my", {
      params: phone ? { phone } : undefined,
    });
  },

  async getByDoctor(doctorId: string): Promise<ApiResponse<{ reports: LabReport[] }>> {
    return apiClient.get<{ reports: LabReport[] }>(`/lab-reports/doctor/${doctorId}`);
  },

  async getAll(params?: {
    search?: string;
    category?: string;
    status?: string;
  }): Promise<ApiResponse<{ reports: LabReport[] }>> {
    return apiClient.get<{ reports: LabReport[] }>("/lab-reports", {
      params,
    });
  },

  async updateStatus(
    id: string,
    status: LabReportStatus
  ): Promise<ApiResponse<{ report: LabReport }>> {
    return apiClient.patch<{ report: LabReport }>(`/lab-reports/${id}/status`, { status });
  },

  async delete(id: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<{ message: string }>(`/lab-reports/${id}`);
  },
};
