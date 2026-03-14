import axios from 'axios';
import api from './api';
import { AuthResponse, LoginFormData, RegisterFormData, User } from '../types/auth';

export interface UpdateProfileData {
  name: string;
  address?: string;
  phone?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ApiErrorResponse {
  message: string;
  status?: number;
}

function getErrorMessage(error: unknown): ApiErrorResponse {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data;

    if (typeof data === 'string' && data.trim().length > 0) {
      return { message: data, status };
    }

    if (data && typeof data === 'object') {
      const message = (data as { message?: unknown }).message;
      if (typeof message === 'string' && message.trim().length > 0) {
        return { message, status };
      }
    }

    if (error.message) {
      return { message: error.message, status };
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return { message: error.message };
  }

  return { message: 'An unexpected error occurred.' };
}

function throwApiError(error: unknown): never {
  const parsed = getErrorMessage(error);
  throw parsed;
}

export const authApi = {
  async login(credentials: LoginFormData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', {
        email: credentials.email,
        password: credentials.password,
      });

      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },

  async register(userData: RegisterFormData): Promise<User> {
    try {
      const response = await api.post<User>('/auth/register', {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
        role: userData.role,
        address: userData.address,
        phone: userData.phone,
      });

      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },

  async getProfile(token: string): Promise<User> {
    try {
      const response = await api.get<User>('/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },

  async updateProfile(profileData: UpdateProfileData): Promise<User> {
    try {
      const response = await api.put<User>('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      throwApiError(error);
    }
  },

  async changePassword(passwordData: ChangePasswordData): Promise<void> {
    try {
      await api.post('/auth/change-password', passwordData);
    } catch (error) {
      throwApiError(error);
    }
  },
};

export default authApi;
