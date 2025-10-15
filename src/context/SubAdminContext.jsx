import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { normalizePermissions } from "../config/subAdminModules";

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
    permissions: {
      ...normalizePermissions({
        faq: {
          view: true,
          add: true,
          edit: true,
          delete: false,
        },
        dashboard: {
          view: true,
        },
      }),
    },
  },
  {
    id: generateId(),
    name: "Arjun",
    email: "arjun@growgold.com",
    password: "goldenpass",
    permissions: {
      ...normalizePermissions({
        faq: {
          view: true,
          add: false,
          edit: false,
          delete: false,
        },
        subAdmin: {
          view: true,
          add: true,
          edit: true,
          delete: false,
        },
      }),
    },
  },
];

export const SubAdminProvider = ({ children }) => {
  const [subadmins, setSubadmins] = useState(DEFAULT_SUBADMINS);

  const addSubAdmin = useCallback((payload) => {
    setSubadmins((prev) => [
      ...prev,
      {
        ...payload,
        permissions: normalizePermissions(payload.permissions),
        id: generateId(),
      },
    ]);
  }, []);

  const updateSubAdmin = useCallback((id, updates) => {
    setSubadmins((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
              permissions: normalizePermissions(updates.permissions ?? item.permissions),
            }
          : item,
      ),
    );
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
