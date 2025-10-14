import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { FiMoreVertical } from "react-icons/fi";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { useSubAdminManagement } from "../context/SubAdminContext";
import { getModuleLabel } from "../config/subAdminModules";
import ConfirmationDialog from "../components/ConfirmationDialog";

const SubAdmins = () => {
  const navigate = useNavigate();
  const { subadmins, deleteSubAdmin } = useSubAdminManagement();
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const menuRefs = useRef({});

  useEffect(() => {
    if (!activeMenuId) {
      return undefined;
    }

    const handleClickOutside = (event) => {
      const currentMenu = menuRefs.current[activeMenuId];
      if (currentMenu && !currentMenu.contains(event.target)) {
        setActiveMenuId(null);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setActiveMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeMenuId]);

  const handleDeleteRequest = (id) => {
    setActiveMenuId(null);
    setPendingDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (!pendingDeleteId) {
      return;
    }

    deleteSubAdmin(pendingDeleteId);
    setPendingDeleteId(null);
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
                  {subadmins.map((subadmin) => {
                    const visibleModules = subadmin.modules.slice(0, 3);
                    const hiddenCount = subadmin.modules.length - visibleModules.length;

                    return (
                      <tr key={subadmin.id}>
                        <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-800">{subadmin.name}</td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">{subadmin.email}</td>
                        <td className="px-4 py-4">
                          {subadmin.modules.length === 0 ? (
                            <span className="text-xs text-slate-400">No modules</span>
                          ) : (
                            <div className="flex flex-wrap items-center gap-2">
                              {visibleModules.map((moduleId) => (
                                <span
                                  key={moduleId}
                                  className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-white px-2.5 py-1 text-xs font-medium text-slate-600 shadow-sm"
                                >
                                  {getModuleLabel(moduleId)}
                                </span>
                              ))}
                              {hiddenCount > 0 && (
                                <span className="inline-flex items-center rounded-full border border-dashed border-[var(--color-border)] px-2.5 py-1 text-xs font-semibold text-slate-500">
                                  +{hiddenCount} more
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-500">
                          {"•".repeat(Math.max(subadmin.password.length, 6))}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">
                          <div
                            className="relative flex justify-end"
                            ref={(node) => {
                              if (node) {
                                menuRefs.current[subadmin.id] = node;
                              } else {
                                delete menuRefs.current[subadmin.id];
                              }
                            }}
                          >
                            <Button
                              type="button"
                              variant="ghost"
                              className="h-11 w-11 rounded-full border border-[var(--color-border)] p-0 shadow-sm"
                              onClick={() =>
                                setActiveMenuId((current) => (current === subadmin.id ? null : subadmin.id))
                              }
                              aria-label={`More actions for ${subadmin.name}`}
                            >
                              <FiMoreVertical className="h-6 w-6" />
                            </Button>
                            {activeMenuId === subadmin.id ? (
                              <div className="absolute right-0 top-12 z-40 w-36 overflow-hidden rounded-lg border border-[var(--color-border)] bg-white shadow-lg">
                                <button
                                  type="button"
                                  className="flex w-full items-center justify-between px-4 py-2 text-sm text-slate-600 transition hover:bg-[var(--color-muted)]"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    navigate(`/sub-admins/${subadmin.id}/edit`);
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  className="flex w-full items-center justify-between px-4 py-2 text-sm text-rose-600 transition hover:bg-rose-50"
                                  onClick={() => handleDeleteRequest(subadmin.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={Boolean(pendingDeleteId)}
        title="Remove sub-admin?"
        description="This action cannot be undone. The selected sub-admin will immediately lose access to all assigned modules."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={handleConfirmDelete}
        destructive
      />
    </div>
  );
};

export default SubAdmins;
