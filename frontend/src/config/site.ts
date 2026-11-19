export const siteConfig = {
  name: "MediCore",
  description: "MediCore - Hospital Management System",
  links: {
    docs: "#",
  },
} as const;

export const envConfig = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api",
  environment: process.env.NODE_ENV || "development",
} as const;
