import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Cookies.get("auth_token") !== undefined;
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("auth_token");
    setIsAuthenticated(!!token);
    setIsLoading(false);

    if (!token && window.location.pathname !== "/login") {
      navigate("/login");
    }
  }, [navigate]);

  const login = async (_username: string, password: string) => {
    if (password === "dragcura321") {
      // Set cookie to expire in 7 days
      Cookies.set("auth_token", "dummy_token", { expires: 7 });
      setIsAuthenticated(true);
      navigate("/");
    } else {
      throw new Error("Invalid password");
    }
  };

  const logout = () => {
    Cookies.remove("auth_token");
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