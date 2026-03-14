export type UserRole = 'Customer' | 'Admin' | 'InventoryManager' | 'Cashier' | number;

// Matches backend UserResponseDto JSON shape.
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  address?: string | null;
  phone?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  isActive: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: UserRole;
  address?: string;
  phone?: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  token: string;
  expiresAt: string;
  user: User;
}

export interface JwtPayload {
  sub: string;
  email: string;
  unique_name: string;
  role: string;
  jti: string;
  nbf?: number;
  exp: number;
  iat?: number;
  iss?: string;
  aud?: string | string[];
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
  setAuth: (user: User, token: string) => void;
  clearError: () => void;
}
