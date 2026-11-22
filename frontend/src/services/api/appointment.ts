import { apiClient } from "./client";
import type { ApiResponse } from "@/types";
import type { Appointment, CreateAppointmentInput } from "@/types/appointment";

export const appointmentService = {
  /**
   * Book a new specialist serial
   */
  async bookSerial(data: CreateAppointmentInput): Promise<ApiResponse<{ appointment: Appointment }>> {
    return apiClient.post<{ appointment: Appointment }>("/appointments", data);
  },

  /**
   * Get my patient appointments
   */
  async getMy(phone?: string): Promise<ApiResponse<{ appointments: Appointment[] }>> {
    return apiClient.get<{ appointments: Appointment[] }>("/appointments/my", {
      params: phone ? { phone } : undefined,
    });
  },

  /**
   * Get doctor appointments
   */
  async getDoctorAppointments(
    doctorId: string,
    date?: string
  ): Promise<ApiResponse<{ appointments: Appointment[] }>> {
    return apiClient.get<{ appointments: Appointment[] }>(`/appointments/doctor/${doctorId}`, {
      params: date ? { date } : undefined,
    });
  },

  /**
   * Get all appointments (Admin/Staff view)
   */
  async getAll(params?: {
    date?: string;
    status?: string;
    department?: string;
  }): Promise<ApiResponse<{ appointments: Appointment[]; total: number }>> {
    return apiClient.get<{ appointments: Appointment[]; total: number }>("/appointments", {
      params,
    });
  },

  /**
   * Update appointment status
   */
  async updateStatus(
    id: string,
    status: string,
    paymentStatus?: string
  ): Promise<ApiResponse<{ appointment: Appointment }>> {
    return apiClient.patch<{ appointment: Appointment }>(`/appointments/${id}/status`, {
      status,
      paymentStatus,
    });
  },
};
