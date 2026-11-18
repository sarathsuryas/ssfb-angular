export type Role = 'ADMIN' | 'STAFF' | 'CUSTOMER';

/** Matches the backend's PublicUser; dates arrive as ISO strings over JSON. */
export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const ROLE_LANDING: Record<Role, string> = {
  ADMIN: '/admin',
  STAFF: '/staff',
  CUSTOMER: '/customer',
};
