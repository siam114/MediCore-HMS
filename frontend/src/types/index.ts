/**
 * Global and API type definitions
 */

export type UserRole = "ADMIN" | "DOCTOR" | "STAFF" | "PATIENT";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
  errors?: unknown;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  status?: string;
}

export interface AuthResponseData {
  user: UserSession;
  token: string;
}

export * from "./doctor";
export * from "./appointment";
