/**
 * Application-wide constants
 */

export const STORAGE_KEYS = {
  AUTH_TOKEN: "medicore_auth_token",
  USER: "medicore_user",
  THEME: "medicore_theme",
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },
} as const;
