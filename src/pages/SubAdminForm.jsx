import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { SUB_ADMIN_MODULES } from "../config/subAdminModules";
import { useSubAdminManagement } from "../context/SubAdminContext";

const createInitialState = () => ({
  name: "",
  email: "",
  password: "",
  modules: [],
});

const SubAdminForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { addSubAdmin, updateSubAdmin, getSubAdminById } = useSubAdminManagement();
  const [formState, setFormState] = useState(createInitialState);
  const [errors, setErrors] = useState({});

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
      modules: [...existingSubAdmin.modules],
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
      const nextModules = new Set(prev.modules);
      if (nextModules.has(moduleId)) {
        nextModules.delete(moduleId);
      } else {
        nextModules.add(moduleId);
      }
      return { ...prev, modules: Array.from(nextModules) };
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
    if (formState.modules.length === 0) {
      nextErrors.modules = "Select at least one module.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      name: formState.name.trim(),
      email: formState.email.trim(),
      password: formState.password.trim(),
      modules: formState.modules,
    };

    if (isEditing) {
      updateSubAdmin(id, payload);
    } else {
      addSubAdmin(payload);
    }

    navigate("/sub-admins");
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
                  <Label>Module Access</Label>
                  <p className="text-xs text-slate-500">
                    Choose the application modules this sub-admin can manage.
                  </p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {SUB_ADMIN_MODULES.map((module) => {
                    const active = formState.modules.includes(module.id);
                    return (
                      <button
                        key={module.id}
                        type="button"
                        onClick={() => toggleModule(module.id)}
                        className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors ${
                          active
                            ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
                            : "border-[var(--color-border)] text-slate-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                        }`}
                      >
                        <span>{module.label}</span>
                        <span
                          className={`h-2 w-2 rounded-full ${
                            active ? "bg-[var(--color-primary-foreground)]" : "bg-slate-300"
                          }`}
                          aria-label={active ? `${module.label} selected` : `${module.label} not selected`}
                        />
                      </button>
                    );
                  })}
                </div>
                {errors.modules && <p className="text-xs text-rose-500">{errors.modules}</p>}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" className="px-5">
                {isEditing ? "Save Changes" : "Create Sub-Admin"}
              </Button>
              <Button type="button" variant="ghost" className="px-5" onClick={() => navigate("/sub-admins")}>
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
            {formState.modules.length === 0 ? (
              <p className="text-sm text-slate-500">No modules selected yet.</p>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2">
                {formState.modules.map((moduleId) => (
                  <li
                    key={moduleId}
                    className="rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)]/40 px-4 py-3 text-sm font-medium text-slate-700"
                  >
                    {moduleLookup[moduleId] ?? moduleId}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SubAdminForm;
