import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, tel: string, role: 'staff' | 'admin', password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - check against registered users in localStorage
    const usersData = localStorage.getItem('users');
    const users: Array<User & { password: string }> = usersData ? JSON.parse(usersData) : [];
    
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return true;
    }
    
    return false;
  };

  const register = async (
    name: string,
    email: string,
    tel: string,
    role: 'staff' | 'admin',
    password: string
  ): Promise<boolean> => {
    // Mock registration
    const usersData = localStorage.getItem('users');
    const users: Array<User & { password: string }> = usersData ? JSON.parse(usersData) : [];
    
    // Check if email already exists
    if (users.some(u => u.email === email)) {
      return false;
    }
    
    const newUser: User & { password: string } = {
      id: Date.now().toString(),
      name,
      email,
      tel,
      role,
      password
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login after registration
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const role: UserRole = user ? user.role : 'guest';

  return (
    <AuthContext.Provider value={{ user, role, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
