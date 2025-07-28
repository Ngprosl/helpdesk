import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simulación de usuarios para demo
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@company.com',
    name: 'Administrador Sistema',
    role: 'admin',
    isActive: true,
    createdAt: '2024-01-01',
    failedAttempts: 0,
    whitelistEntry: true
  },
  {
    id: '2',
    email: 'tech1@company.com',
    name: 'Juan Pérez',
    role: 'technician',
    department: 'IT Support',
    isActive: true,
    createdAt: '2024-01-01',
    failedAttempts: 0
  },
  {
    id: '3',
    email: 'user@company.com',
    name: 'María García',
    role: 'user',
    department: 'Marketing',
    isActive: true,
    createdAt: '2024-01-01',
    failedAttempts: 0
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar sesión existente
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulación de autenticación
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (!foundUser) {
      setIsLoading(false);
      return false;
    }

    // Verificar si el usuario está bloqueado
    if (foundUser.blockedUntil && new Date(foundUser.blockedUntil) > new Date()) {
      setIsLoading(false);
      return false;
    }

    // Verificar whitelist si está habilitada
    const systemConfig = JSON.parse(localStorage.getItem('systemConfig') || '{}');
    if (systemConfig.security?.requireWhitelist && !foundUser.whitelistEntry) {
      setIsLoading(false);
      return false;
    }

    // Simulación de verificación de contraseña (en producción sería hasheada)
    const validPassword = password === 'password123';
    
    if (!validPassword) {
      // Incrementar intentos fallidos
      foundUser.failedAttempts += 1;
      
      // Bloquear si supera el límite
      const maxAttempts = systemConfig.security?.maxFailedAttempts || 3;
      if (foundUser.failedAttempts >= maxAttempts) {
        const lockoutDuration = systemConfig.security?.lockoutDuration || 15;
        foundUser.blockedUntil = new Date(Date.now() + lockoutDuration * 60000).toISOString();
      }
      
      setIsLoading(false);
      return false;
    }

    // Reset intentos fallidos en login exitoso
    foundUser.failedAttempts = 0;
    foundUser.blockedUntil = undefined;
    foundUser.lastLogin = new Date().toISOString();

    setUser(foundUser);
    localStorage.setItem('currentUser', JSON.stringify(foundUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      isLoading
    }}>
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