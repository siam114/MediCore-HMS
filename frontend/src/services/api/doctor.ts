import { apiClient } from "./client";
import type { ApiResponse } from "@/types";
import type { Doctor, CreateDoctorPayload, DepartmentSummary } from "@/types/doctor";

export const doctorService = {
  async getAll(params?: {
    department?: string;
    status?: string;
    search?: string;
  }): Promise<ApiResponse<{ doctors: Doctor[]; total: number }>> {
    return apiClient.get<{ doctors: Doctor[]; total: number }>("/doctors", {
      params,
    });
  },

  async getById(id: string): Promise<ApiResponse<{ doctor: Doctor }>> {
    return apiClient.get<{ doctor: Doctor }>(`/doctors/${id}`);
  },

  async getMyProfile(): Promise<ApiResponse<{ doctor: Doctor }>> {
    return apiClient.get<{ doctor: Doctor }>("/doctors/profile/me");
  },

  async create(data: CreateDoctorPayload): Promise<ApiResponse<{ doctor: Doctor }>> {
    return apiClient.post<{ doctor: Doctor }>("/doctors", data);
  },

  async update(id: string, data: Partial<CreateDoctorPayload>): Promise<ApiResponse<{ doctor: Doctor }>> {
    return apiClient.put<{ doctor: Doctor }>(`/doctors/${id}`, data);
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/doctors/${id}`);
  },

  async getDepartments(): Promise<ApiResponse<{ departments: DepartmentSummary[] }>> {
    return apiClient.get<{ departments: DepartmentSummary[] }>("/doctors/departments");
  },
};
