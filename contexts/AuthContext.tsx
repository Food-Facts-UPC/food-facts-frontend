"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useCookies } from '@/lib/hooks/useCookies';

interface User {
  id: number;
  username: string;
  roles: string[];
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAdmin: () => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setCookie, deleteCookie } = useCookies();

  useEffect(() => {
    console.log('AuthContext: useEffect triggered');
    
    const initializeAuth = async () => {
      // Verificar si estamos en el cliente antes de usar localStorage
      if (typeof window !== 'undefined') {
        try {
          const storedUser = localStorage.getItem('user');
          console.log('AuthContext: Stored user from localStorage', storedUser);
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            console.log('AuthContext: Parsed user data', userData);
            setUser(userData);
          } else {
            console.log('AuthContext: No stored user found');
          }
        } catch (error) {
          console.error('AuthContext: Error parsing stored user:', error);
          localStorage.removeItem('user');
        }

        // Escuchar evento de logout automático
        const handleAuthLogout = () => {
          console.log('AuthContext: Received auth-logout event');
          setUser(null);
          // Asegurar que la cookie también se elimine
          document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
          localStorage.removeItem('user');
        };

        window.addEventListener('auth-logout', handleAuthLogout);
        
        // Cleanup event listener
        return () => {
          window.removeEventListener('auth-logout', handleAuthLogout);
        };
      }
    };

    initializeAuth().finally(() => {
      // Marcar como cargado después de la inicialización
      setIsLoading(false);
    });
  }, []);

  const login = (userData: User) => {
    console.log('AuthContext: login() called with userData:', userData);
    setUser(userData);
    console.log('AuthContext: User state updated');
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('AuthContext: User data stored in localStorage');
      
      // También guardar en cookie para el middleware
      setCookie('user', JSON.stringify(userData), 7);
    }
  };

  const logout = () => {
    console.log('AuthContext: logout() called');
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      console.log('AuthContext: User data removed from localStorage');
      
      // También eliminar cookie
      deleteCookie('user');
      console.log('AuthContext: User cookie deleted');
    }
  };

  const isAdmin = () => {
    if (!user) {
      console.log('AuthContext: isAdmin() called, no user');
      return false;
    }
    
    console.log('AuthContext: isAdmin() called, user roles:', user.roles);
    const hasAdminRole = user.roles && (user.roles.includes('ROLE_ADMIN') || user.roles.includes('ADMIN'));
    console.log('AuthContext: hasAdminRole:', hasAdminRole);
    
    return hasAdminRole;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
