import { apiClient } from "./client";
import type { ApiResponse } from "@/types";
import type { Prescription, CreatePrescriptionPayload } from "@/types/prescription";

export const prescriptionService = {
  async create(data: CreatePrescriptionPayload): Promise<ApiResponse<{ prescription: Prescription }>> {
    return apiClient.post<{ prescription: Prescription }>("/prescriptions", data);
  },

  async getById(id: string): Promise<ApiResponse<{ prescription: Prescription }>> {
    return apiClient.get<{ prescription: Prescription }>(`/prescriptions/${id}`);
  },

  async getByDoctor(doctorId: string): Promise<ApiResponse<{ prescriptions: Prescription[] }>> {
    return apiClient.get<{ prescriptions: Prescription[] }>(`/prescriptions/doctor/${doctorId}`);
  },

  async getMy(phone?: string): Promise<ApiResponse<{ prescriptions: Prescription[] }>> {
    return apiClient.get<{ prescriptions: Prescription[] }>("/prescriptions/my", {
      params: phone ? { phone } : undefined,
    });
  },

  async getAll(department?: string): Promise<ApiResponse<{ prescriptions: Prescription[] }>> {
    return apiClient.get<{ prescriptions: Prescription[] }>("/prescriptions", {
      params: department ? { department } : undefined,
    });
  },
};
