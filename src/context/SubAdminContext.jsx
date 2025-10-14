import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { SUB_ADMIN_MODULES } from "../config/subAdminModules";

const SubAdminContext = createContext(undefined);

const generateId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return Math.random().toString(36).slice(2, 10);
};

const DEFAULT_SUBADMINS = [
  {
    id: generateId(),
    name: "Saanvi",
    email: "saanvi@growgold.com",
    password: "welcome123",
    modules: [SUB_ADMIN_MODULES[0].id, SUB_ADMIN_MODULES[1].id, SUB_ADMIN_MODULES[4].id],
  },
  {
    id: generateId(),
    name: "Arjun",
    email: "arjun@growgold.com",
    password: "goldenpass",
    modules: [SUB_ADMIN_MODULES[2].id, SUB_ADMIN_MODULES[3].id],
  },
];

export const SubAdminProvider = ({ children }) => {
  const [subadmins, setSubadmins] = useState(DEFAULT_SUBADMINS);

  const addSubAdmin = useCallback((payload) => {
    setSubadmins((prev) => [...prev, { ...payload, id: generateId() }]);
  }, []);

  const updateSubAdmin = useCallback((id, updates) => {
    setSubadmins((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  }, []);

  const deleteSubAdmin = useCallback((id) => {
    setSubadmins((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const getSubAdminById = useCallback((id) => subadmins.find((item) => item.id === id) ?? null, [subadmins]);

  const value = useMemo(
    () => ({
      subadmins,
      addSubAdmin,
      updateSubAdmin,
      deleteSubAdmin,
      getSubAdminById,
    }),
    [subadmins, addSubAdmin, updateSubAdmin, deleteSubAdmin, getSubAdminById],
  );

  return <SubAdminContext.Provider value={value}>{children}</SubAdminContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSubAdminManagement = () => {
  const context = useContext(SubAdminContext);

  if (!context) {
    throw new Error("useSubAdminManagement must be used within a SubAdminProvider");
  }

  return context;
};
