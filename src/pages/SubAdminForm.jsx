import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import {
  SUB_ADMIN_MODULES,
  createEmptyPermissions,
  normalizePermissions,
  PERMISSION_LABELS,
} from "../config/subAdminModules";
import { useSubAdminManagement } from "../context/SubAdminContext";

const createInitialState = () => ({
  name: "",
  email: "",
  password: "",
  permissions: createEmptyPermissions(),
});


const SubAdminForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { addSubAdmin, updateSubAdmin, getSubAdminById } = useSubAdminManagement();
  const [formState, setFormState] = useState(createInitialState);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setFormState(createInitialState());
      return;
    }

    const existingSubAdmin = getSubAdminById(id);
    if (!existingSubAdmin) {
      navigate("/sub-admins", { replace: true });
      return;
    }

    setFormState({
      name: existingSubAdmin.name,
      email: existingSubAdmin.email,
      password: existingSubAdmin.password,
      permissions: normalizePermissions(existingSubAdmin.permissions),
    });
  }, [id, isEditing, getSubAdminById, navigate]);

  const moduleLookup = useMemo(
    () => Object.fromEntries(SUB_ADMIN_MODULES.map((module) => [module.id, module.label])),
    [],
  );

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const toggleModule = (moduleId) => {
    setFormState((prev) => {
      const currentActions = prev.permissions[moduleId] ?? {};
      const currentlyEnabled = Object.values(currentActions).some(Boolean);
      const module = SUB_ADMIN_MODULES.find((item) => item.id === moduleId);

      if (!module) {
        return prev;
      }

      const nextActions = module.actions.reduce((acc, action) => {
        if (currentlyEnabled) {
          acc[action] = false;
        } else {
          const previousValue = currentActions[action];
          acc[action] = typeof previousValue === "boolean" ? previousValue : action === "view";
        }
        return acc;
      }, {});

      return {
        ...prev,
        permissions: {
          ...prev.permissions,
          [moduleId]: nextActions,
        },
      };
    });
  };

  const toggleAction = (moduleId, action) => {
    setFormState((prev) => {
      const module = SUB_ADMIN_MODULES.find((item) => item.id === moduleId);
      if (!module || !module.actions.includes(action)) {
        return prev;
      }

      const currentActions = prev.permissions[moduleId] ?? {};
      const nextModuleActions = module.actions.reduce((acc, moduleAction) => {
        acc[moduleAction] = currentActions[moduleAction] ?? false;
        return acc;
      }, {});

      nextModuleActions[action] = !currentActions[action];

      return {
        ...prev,
        permissions: {
          ...prev.permissions,
          [moduleId]: nextModuleActions,
        },
      };
    });
  };

  const validate = () => {
    const nextErrors = {};

    if (!formState.name.trim()) {
      nextErrors.name = "Enter at least one word for the name.";
    }
    if (!formState.email.trim()) {
      nextErrors.email = "Enter at least one word for the email.";
    }
    if (!formState.password.trim()) {
      nextErrors.password = "Enter at least one word for the password.";
    }
    const hasAtLeastOnePermission = Object.values(formState.permissions).some((actions) =>
      Object.values(actions ?? {}).some(Boolean),
    );

    if (!hasAtLeastOnePermission) {
      nextErrors.permissions = "Enable at least one module permission.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      name: formState.name.trim(),
      email: formState.email.trim(),
      password: formState.password.trim(),
      permissions: normalizePermissions(formState.permissions),
    };

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      if (isEditing) {
        await updateSubAdmin(id, payload);
      } else {
        await addSubAdmin(payload);
      }

      navigate("/sub-admins");
    } catch (error) {
      const message =
        error?.response?.data?.message ??
        error?.response?.data?.error ??
        error?.message ??
        "Failed to save sub-admin. Please try again.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Access Control</p>
          <h1 className="text-3xl font-semibold text-slate-900">
            {isEditing ? "Edit Sub-Admin" : "Create Sub-Admin"}
          </h1>
          <p className="text-sm text-slate-500">
            {isEditing
              ? "Update the sub-admin's credentials and module responsibilities."
              : "Provide the details for your new sub-admin and assign the modules they can manage."}
          </p>
        </div>
        <Button type="button" variant="outline" className="px-4" onClick={() => navigate("/sub-admins")}>
          Back to Directory
        </Button>
      </div>

      <Card className="border-[var(--color-border)]">
        <CardHeader>
          <CardTitle>{isEditing ? "Sub-Admin Details" : "New Sub-Admin"}</CardTitle>
          <CardDescription>
            Capture the key identity fields and choose the application areas this sub-admin can access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Sub-Admin Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleInputChange}
                  placeholder="Enter name"
                  autoComplete="off"
                />
                {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleInputChange}
                  placeholder="subadmin@example.com"
                  autoComplete="off"
                />
                {errors.email && <p className="text-xs text-rose-500">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Temporary Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="text"
                  value={formState.password}
                  onChange={handleInputChange}
                  placeholder="Provide a starter password"
                  autoComplete="new-password"
                />
                {errors.password && <p className="text-xs text-rose-500">{errors.password}</p>}
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label>Module Permissions</Label>
                  <p className="text-xs text-slate-500">
                    Activate a module to configure the specific actions this sub-admin can take.
                  </p>
                </div>
                <div className="space-y-4">
                  {SUB_ADMIN_MODULES.map((module) => {
                    const actions = formState.permissions[module.id] ?? {};
                    const moduleEnabled = Object.values(actions).some(Boolean);

                    return (
                      <div
                        key={module.id}
                        className={`rounded-lg border px-4 py-4 transition ${
                          moduleEnabled
                            ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                            : "border-[var(--color-border)] bg-white"
                        }`}
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{module.label}</p>
                            <p className="text-xs text-slate-500">
                              {moduleEnabled
                                ? "Adjust the granular permissions below."
                                : "Enable this module to assign permissions."}
                            </p>
                          </div>
                          <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-600">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-offset-0"
                              checked={moduleEnabled}
                              onChange={() => toggleModule(module.id)}
                            />
                            <span>{moduleEnabled ? "Enabled" : "Disabled"}</span>
                          </label>
                        </div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                          {module.actions.map((action) => {
                            const checked = actions[action] ?? false;
                            return (
                              <label
                                key={action}
                                className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium transition ${
                                  checked
                                    ? "border-[var(--color-primary)] bg-white text-[var(--color-primary)]"
                                    : "border-[var(--color-border)] text-slate-600 hover:border-[var(--color-primary)]"
                                } ${moduleEnabled ? "opacity-100" : "opacity-60"}`}
                              >
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-offset-0"
                                  // disabled={!moduleEnabled}
                                  checked={checked}
                                  onChange={() => toggleAction(module.id, action)}
                                />
                                <span>{PERMISSION_LABELS[action] ?? action}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {errors.permissions && <p className="text-xs text-rose-500">{errors.permissions}</p>}
              </div>

            </div>

            {submitError && <p className="text-sm text-rose-500">{submitError}</p>}

            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" className="px-5" disabled={isSubmitting} aria-busy={isSubmitting}>
                {isSubmitting
                  ? isEditing
                    ? "Saving..."
                    : "Creating..."
                  : isEditing
                    ? "Save Changes"
                    : "Create Sub-Admin"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="px-5"
                onClick={() => navigate("/sub-admins")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {isEditing && (
        <Card className="border-[var(--color-border)]">
          <CardHeader>
            <CardTitle>Module Preview</CardTitle>
            <CardDescription>Confirm the areas of the platform this sub-admin will retain control over.</CardDescription>
          </CardHeader>
          <CardContent>
            {SUB_ADMIN_MODULES.every((module) =>
              !Object.values(formState.permissions[module.id] ?? {}).some(Boolean),
            ) ? (
              <p className="text-sm text-slate-500">No modules selected yet.</p>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2">
                {SUB_ADMIN_MODULES.map((module) => {
                  const actions = formState.permissions[module.id] ?? {};
                  const activeActions = Object.entries(actions)
                    .filter(([, value]) => value)
                    .map(([action]) => PERMISSION_LABELS[action] ?? action);

                  if (activeActions.length === 0) {
                    return null;
                  }

                  return (
                    <li
                      key={module.id}
                      className="space-y-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)]/40 px-4 py-3 text-sm text-slate-700"
                    >
                      <p className="font-semibold">{moduleLookup[module.id] ?? module.id}</p>
                      <p className="text-xs text-slate-500">{activeActions.join(', ')}</p>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SubAdminForm;
