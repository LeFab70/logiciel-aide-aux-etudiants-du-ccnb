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
