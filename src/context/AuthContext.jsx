import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const storageKey = "grow-gold-admin-auth";

const AuthContext = createContext({
  isAuthenticated: false,
  login: () => Promise.resolve(false),
  logout: () => {},
  isLoading: true,
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored === "true") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async ({ username, password }) => {
    if (username === "admin" && password === "growgold") {
      window.localStorage.setItem(storageKey, "true");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(storageKey);
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      login,
      logout,
    }),
    [isAuthenticated, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
