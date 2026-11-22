import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/constants";
import type { AuthResponseData, UserSession, ApiResponse } from "@/types";
import type { LoginFormValues, RegisterFormValues } from "@/lib/validations";

export const authService = {
  async login(credentials: LoginFormValues): Promise<ApiResponse<AuthResponseData>> {
    return apiClient.post<AuthResponseData>(API_ENDPOINTS.AUTH.LOGIN, {
      email: credentials.email,
      password: credentials.password,
    });
  },

  async register(data: RegisterFormValues): Promise<ApiResponse<AuthResponseData>> {
    return apiClient.post<AuthResponseData>(API_ENDPOINTS.AUTH.REGISTER, {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      phone: data.phone,
    });
  },

  async getMe(): Promise<ApiResponse<{ user: UserSession }>> {
    return apiClient.get<{ user: UserSession }>(API_ENDPOINTS.AUTH.ME);
  },

  async logout(): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
  },

  async googleAuth(data: {
    name: string;
    email: string;
    avatar?: string;
    googleId?: string;
  }): Promise<ApiResponse<AuthResponseData>> {
    return apiClient.post<AuthResponseData>("/auth/google", data);
  },

  async getAllUsers(): Promise<ApiResponse<{ users: UserSession[]; total: number }>> {
    return apiClient.get<{ users: UserSession[]; total: number }>("/auth/users");
  },

  async updateUserRole(
    userId: string,
    role: "ADMIN" | "DOCTOR" | "STAFF" | "PATIENT"
  ): Promise<ApiResponse<{ user: UserSession }>> {
    return apiClient.patch<{ user: UserSession }>(`/auth/users/${userId}/role`, { role });
  },

  async deleteUser(userId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<{ message: string }>(`/auth/users/${userId}`);
  },
};
