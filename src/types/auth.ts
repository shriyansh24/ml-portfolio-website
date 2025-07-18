import { User, UserSession } from './index';
import { Session } from 'next-auth';

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkSession: () => Promise<boolean>;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ExtendedSession extends Session {
  user: User;
  expires: string;
}