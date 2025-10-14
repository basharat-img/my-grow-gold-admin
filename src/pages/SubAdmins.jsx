import React, { useMemo } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { useSubAdminManagement } from "../context/SubAdminContext";
import { getModuleLabel } from "../config/subAdminModules";

const SubAdmins = () => {
  const navigate = useNavigate();
  const { subadmins, deleteSubAdmin } = useSubAdminManagement();

  const moduleSummary = useMemo(
    () =>
      subadmins.reduce((acc, subadmin) => {
        subadmin.modules.forEach((moduleId) => {
          acc[moduleId] = (acc[moduleId] ?? 0) + 1;
        });
        return acc;
      }, {}),
    [subadmins],
  );

  const handleDelete = (id) => {
    const confirmation = window.confirm("Are you sure you want to delete this sub-admin?");
    if (!confirmation) return;

    deleteSubAdmin(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Access Control</p>
          <h1 className="text-3xl font-semibold text-slate-900">Sub-Admin Directory</h1>
          <p className="text-sm text-slate-500">
            Review who has access to each module and make quick adjustments to their roles.
          </p>
        </div>
        <Button type="button" className="px-5" onClick={() => navigate("/sub-admins/new")}>
          Add Sub-Admin
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <Card className="border-[var(--color-border)]">
          <CardHeader>
            <CardTitle>Sub-Admin List</CardTitle>
            <CardDescription>Monitor sub-admin credentials and module ownership at a glance.</CardDescription>
          </CardHeader>
          <CardContent>
            {subadmins.length === 0 ? (
              <div className="flex flex-col items-center justify-center space-y-3 rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-muted)]/30 px-6 py-12 text-center">
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-slate-800">No sub-admins yet</h2>
                  <p className="text-sm text-slate-500">
                    Create your first sub-admin to begin delegating responsibilities across the workspace.
                  </p>
                </div>
                <Button type="button" onClick={() => navigate("/sub-admins/new")}>
                  Create Sub-Admin
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Name
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Email
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Modules
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Password
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {subadmins.map((subadmin) => (
                      <tr key={subadmin.id}>
                        <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-800">{subadmin.name}</td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">{subadmin.email}</td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            {subadmin.modules.map((moduleId) => (
                              <span
                                key={moduleId}
                                className="inline-flex items-center rounded-full bg-[var(--color-muted)] px-2.5 py-1 text-xs font-medium text-[var(--color-primary)]"
                              >
                                {getModuleLabel(moduleId)}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-500">
                          {"•".repeat(Math.max(subadmin.password.length, 6))}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              className="px-3"
                              onClick={() => navigate(`/sub-admins/${subadmin.id}/edit`)}
                            >
                              Edit
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              className="border-rose-200 px-3 text-rose-600 hover:bg-rose-50"
                              onClick={() => handleDelete(subadmin.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-[var(--color-border)]">
          <CardHeader>
            <CardTitle>Module Coverage</CardTitle>
            <CardDescription>Understand how responsibilities are distributed across the team.</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(moduleSummary).length === 0 ? (
              <p className="text-sm text-slate-500">
                Assign modules to sub-admins to see their distribution summary here.
              </p>
            ) : (
              <ul className="space-y-3">
                {Object.entries(moduleSummary).map(([moduleId, count]) => (
                  <li key={moduleId} className="flex items-center justify-between text-sm text-slate-600">
                    <span className="font-medium text-slate-700">{getModuleLabel(moduleId)}</span>
                    <span className="rounded-full bg-[var(--color-muted)] px-2.5 py-1 text-xs font-semibold text-[var(--color-primary)]">
                      {count} {count === 1 ? "user" : "users"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubAdmins;
