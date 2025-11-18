import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { authService } from '../services/authService';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, tel: string, role: 'staff' | 'admin', password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          // Token is invalid or expired
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login(email, password);
      
      // Store token first so we can use it to fetch full user profile
      localStorage.setItem('token', response.token);
      
      // Fetch full user profile with all fields (including role)
      const fullUser = await authService.getCurrentUser();
      
      // Store full user and update context
      localStorage.setItem('user', JSON.stringify(fullUser));
      setUser(fullUser);

      return true;
    } catch (error: any) {
      localStorage.removeItem('token');
      toast.error(error.response?.data?.message || 'Invalid email or password');
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    tel: string,
    role: 'staff' | 'admin',
    password: string
  ): Promise<boolean> => {
    try {
      const response = await authService.register({
        name,
        email,
        tel,
        role,
        password
      });
      
      // Store token first so we can use it to fetch full user profile
      localStorage.setItem('token', response.token);
      
      // Fetch full user profile with all fields (including role)
      const fullUser = await authService.getCurrentUser();
      
      // Store full user and update context
      localStorage.setItem('user', JSON.stringify(fullUser));
      setUser(fullUser);

      return true;
    } catch (error: any) {
      localStorage.removeItem('token');
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const role: UserRole = user?.role || 'guest';

  return (
    <AuthContext.Provider value={{ user, role, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Add displayName for better HMR support
AuthProvider.displayName = 'AuthProvider';

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}