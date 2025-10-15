import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import API_ENDPOINTS from "../config/apiEndpoints";
import { AUTH_EVENTS, ROUTE_PATHS, STORAGE_KEYS } from "../config/constants";
import { publicApi } from "../lib/apiClients";

const storageKey = STORAGE_KEYS.authToken;

const AuthContext = createContext({
  isAuthenticated: false,
  login: () => Promise.resolve({ success: false }),
  logout: () => {},
  isLoading: true,
  token: null,
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      setIsAuthenticated(true);
      setToken(stored);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const handleForcedLogout = () => {
      setIsAuthenticated(false);
      setToken(null);
    };

    window.addEventListener(AUTH_EVENTS.logout, handleForcedLogout);

    return () => {
      window.removeEventListener(AUTH_EVENTS.logout, handleForcedLogout);
    };
  }, []);

  const login = useCallback(async ({ email, password }) => {
    try {
      const response = await publicApi.post(API_ENDPOINTS.auth.login, { email, password });
      const receivedToken =
        response?.data?.data?.token ??
        response?.data?.token ??
        response?.data?.accessToken ??
        response?.data?.access_token ??
        null;

      if (!receivedToken) {
        throw new Error("Authentication token missing in response");
      }

      window.localStorage.setItem(storageKey, receivedToken);
      setIsAuthenticated(true);
      setToken(receivedToken);

      return { success: true };
    } catch (error) {
      console.error("Login failed", error);
      window.localStorage.removeItem(storageKey);
      setIsAuthenticated(false);
      setToken(null);

      const message =
        error?.response?.data?.message ??
        error?.message ??
        "Invalid credentials. Please try again.";

      return { success: false, message };
    }
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(storageKey);
    setIsAuthenticated(false);
    setToken(null);
    window.dispatchEvent(new Event(AUTH_EVENTS.logout));
    if (typeof window !== "undefined" && window.location.pathname !== ROUTE_PATHS.login) {
      window.location.replace(ROUTE_PATHS.login);
    }
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      login,
      logout,
      token,
    }),
    [isAuthenticated, isLoading, login, logout, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
