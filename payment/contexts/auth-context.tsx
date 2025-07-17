"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api"
import type { User, LoginRequest, RegisterRequest } from "@/types/api"

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  userRole: User["role"] | "ANONYMOUS";
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;
  const userRole = user?.role || "ANONYMOUS";

  const fetchCurrentUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const currentUser = await apiClient.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const loggedInUser = await apiClient.login({ email, password } as LoginRequest);
      setUser(loggedInUser);
      router.push("/dashboard"); // Redirect to dashboard after successful login
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<boolean> => {
    try {
      setIsLoading(true);
      const registeredUser = await apiClient.register(userData);
      setUser(registeredUser);
      router.push("/dashboard"); // Redirect to dashboard after successful registration
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await apiClient.logout();
      setUser(null);
      router.push("/auth/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasPermission = useCallback((permission: string): boolean => {
    if (!user || !user.permissions) {
      return false;
    }
    return user.permissions.includes(permission);
  }, [user]);

  const authContextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    hasPermission,
    userRole,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}