export const HOSPITAL_DEPARTMENTS = [
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "Dermatology",
  "General Medicine",
  "General Surgery",
  "Gynecology & Obstetrics",
  "Ophthalmology",
  "ENT (Ear, Nose, Throat)",
  "Psychiatry",
  "Urology",
  "Gastroenterology",
  "Nephrology",
  "Oncology",
] as const;

export type HospitalDepartment = (typeof HOSPITAL_DEPARTMENTS)[number];
