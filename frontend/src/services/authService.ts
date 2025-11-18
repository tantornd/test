import api from '../config/api';
import { User } from '../types';

interface AuthResponse {
  success: boolean;
  token: string;
  data?: User;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface RegisterData {
  name: string;
  email: string;
  tel: string;
  role: 'staff' | 'admin';
  password: string;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post<any>('/auth/login', {
      email,
      password,
    });
    // Backend returns { success, token, _id, name, email } - missing role and tel
    // We'll fetch full profile separately using the token
    return {
      token: response.data.token,
      user: {} as User // Will be replaced by getCurrentUser() call
    };
  },

  async register(data: RegisterData): Promise<LoginResponse> {
    const response = await api.post<any>('/auth/register', data);
    // Backend returns { success, token, _id, name, email } - missing role and tel
    // We'll fetch full profile separately using the token
    return {
      token: response.data.token,
      user: {} as User // Will be replaced by getCurrentUser() call
    };
  },

  async logout(): Promise<void> {
    try {
      await api.get('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<{ success: boolean; data: User }>('/auth/me');
    return response.data.data;
  },
};
