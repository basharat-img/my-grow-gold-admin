import axios from "axios";
import { AUTH_EVENTS, ROUTE_PATHS, STORAGE_KEYS } from "../config/constants";

const baseURL = import.meta.env.VITE_BASE_URL ?? "";

if (!baseURL) {
  console.warn("VITE_BASE_URL is not defined. API requests may fail.");
}

const buildUnauthorizedHandler = () => (error) => {
  const status = error?.response?.status ?? error?.status;
  if (status === 401 || status === 403) {
    try {
      window.localStorage.removeItem(STORAGE_KEYS.authToken);
    } catch (storageError) {
      console.error("Failed to clear auth token", storageError);
    }

    window.dispatchEvent(new Event(AUTH_EVENTS.logout));

    if (typeof window !== "undefined" && window.location.pathname !== ROUTE_PATHS.login) {
      window.location.replace(ROUTE_PATHS.login);
    }
  }

  return Promise.reject(error);
};

export const publicApi = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
  },
});

export const authApi = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
  },
});

authApi.interceptors.request.use((config) => {
  const updatedConfig = { ...config };
  if (!updatedConfig.headers) {
    updatedConfig.headers = {};
  }

  try {
    const token = window.localStorage.getItem(STORAGE_KEYS.authToken);
    if (token) {
      updatedConfig.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Failed to read auth token", error);
  }

  return updatedConfig;
});

const handleUnauthorized = buildUnauthorizedHandler();

authApi.interceptors.response.use((response) => response, handleUnauthorized);
publicApi.interceptors.response.use((response) => response, handleUnauthorized);

export default {
  publicApi,
  authApi,
};
