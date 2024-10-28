import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Initialize state from localStorage during component creation
    return localStorage.getItem("auth_token") !== null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    setIsAuthenticated(!!token);
    setIsLoading(false);

    // Redirect to login if no token found
    if (!token && window.location.pathname !== '/login') {
      navigate('/login');
    }
  }, [navigate]);

  const login = async (username: string, password: string) => {
    if (username === "admin" && password === "password") {
      localStorage.setItem("auth_token", "dummy_token");
      setIsAuthenticated(true);
      navigate("/");
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};