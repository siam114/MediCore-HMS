export interface Doctor {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  specialization: string;
  qualification: string;
  experienceYears: number;
  consultationFee: number;
  availableDays: string[];
  availableTime: {
    start: string;
    end: string;
  };
  roomNumber: string;
  status: "ACTIVE" | "INACTIVE" | "ON_LEAVE";
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDoctorPayload {
  name: string;
  email: string;
  phone: string;
  department: string;
  specialization: string;
  qualification: string;
  experienceYears: number;
  consultationFee: number;
  availableDays: string[];
  availableTime: {
    start: string;
    end: string;
  };
  roomNumber: string;
  defaultPassword?: string;
}

export interface DepartmentSummary {
  name: string;
  count: number;
}
