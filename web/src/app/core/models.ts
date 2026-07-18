export type Role = 'STUDENT' | 'TUTOR' | 'ADMIN';

export interface Campus {
  id: number;
  code: string;
  name: string;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  campus: Campus;
  roles: Role[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  campusId: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface PendingRegistrationResponse {
  email: string;
  expiresAt: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface ResendCodeRequest {
  email: string;
}

export interface Faq {
  id: number;
  campusId: number | null;
  question: string;
  answer: string;
  category: string | null;
  displayOrder: number;
}

export interface DirectoryContact {
  id: number;
  campusId: number;
  name: string;
  role: string | null;
  department: string | null;
  email: string | null;
  phone: string | null;
  officeLocation: string | null;
}

export type PlanPointCategory = 'CLASSROOM' | 'SERVICE' | 'CAFETERIA' | 'LIBRARY' | 'OTHER';

export interface PlanPoint {
  id: number;
  label: string;
  xPercent: number;
  yPercent: number;
  category: PlanPointCategory;
  description: string | null;
}

export interface CampusPlan {
  id: number;
  campusId: number;
  imageUrl: string | null;
  description: string | null;
  points: PlanPoint[];
}
