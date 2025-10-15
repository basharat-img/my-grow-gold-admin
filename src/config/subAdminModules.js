export const SUB_ADMIN_MODULES = [
  {
    id: "faq",
    label: "FAQ",
    actions: ["view", "add", "edit", "delete"],
  },
  {
    id: "dashboard",
    label: "Dashboard",
    actions: ["view"],
  },
  {
    id: "subAdmin",
    label: "Sub-Admin",
    actions: ["view", "add", "edit", "delete"],
  },
];

export const createEmptyPermissions = () =>
  SUB_ADMIN_MODULES.reduce((acc, module) => {
    acc[module.id] = module.actions.reduce((actionMap, action) => {
      actionMap[action] = false;
      return actionMap;
    }, {});
    return acc;
  }, {});

export const normalizePermissions = (overrides = {}) => {
  const base = createEmptyPermissions();

  Object.entries(overrides).forEach(([moduleId, actions]) => {
    if (!base[moduleId]) {
      base[moduleId] = {};
    }

    Object.entries(actions ?? {}).forEach(([action, value]) => {
      base[moduleId][action] = Boolean(value);
    });
  });

  return base;
};

export const PERMISSION_LABELS = {
  view: "View",
  add: "Add",
  edit: "Edit",
  delete: "Delete",
};
