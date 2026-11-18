import { AuthUser } from '@core/auth/auth.models';

/** Backend PublicUser shape. */
export type ManagedUser = AuthUser;

export interface CreateUserRequest {
  email: string;
  password: string;
}
