export const SUB_ADMIN_MODULES = [
  { id: "dashboard", label: "Dashboard" },
  { id: "analytics", label: "Analytics" },
  { id: "team", label: "Team" },
  { id: "campaigns", label: "Campaigns" },
  { id: "reports", label: "Reports" },
];

export const getModuleLabel = (moduleId) => {
  const module = SUB_ADMIN_MODULES.find((item) => item.id === moduleId);
  return module ? module.label : moduleId;
};
