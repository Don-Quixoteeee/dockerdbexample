"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type User = { name?: string; email: string } | null;

type AuthContextType = {
  user: User;
  token: string | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_TOKEN = "bp_token";
const STORAGE_USER = "bp_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const t = localStorage.getItem(STORAGE_TOKEN);
      const u = localStorage.getItem(STORAGE_USER);
      setToken(t);
      setUser(u ? JSON.parse(u) : null);
    } catch (e) {
      setToken(null);
      setUser(null);
    }
  }, []);

  const login = useCallback((email: string, name?: string) => {
    // Mock token/demo login: in a real app call your API
    const demoToken = `demo-${Date.now()}`;
    const u = { email, name };
    localStorage.setItem(STORAGE_TOKEN, demoToken);
    localStorage.setItem(STORAGE_USER, JSON.stringify(u));
    setToken(demoToken);
    setUser(u);
    // After login, navigate to root if at /login
    if (pathname === "/login") router.push("/");
  }, [pathname, router]);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_TOKEN);
    localStorage.removeItem(STORAGE_USER);
    setToken(null);
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthProvider;
