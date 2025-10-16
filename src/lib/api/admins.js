import API_ENDPOINTS from "../../config/apiEndpoints";
import { authApi } from "../apiClients";

const extractAdminPayload = (response, fallback) => {
  const potentialPayload =
    response?.data?.data ??
    response?.data?.admin ??
    response?.data?.user ??
    response?.data ??
    null;

  if (potentialPayload && typeof potentialPayload === "object" && !Array.isArray(potentialPayload)) {
    return potentialPayload;
  }

  return fallback;
};

export const createAdmin = async ({ email, name, password, permissions }) => {
  const response = await authApi.post(API_ENDPOINTS.admins.create, {
    email,
    name,
    password,
    permissions,
  });

  const admin = extractAdminPayload(response, {
    email,
    name,
    password,
    permissions,
  });

  return {
    admin,
    response,
  };
};

export default {
  createAdmin,
};
