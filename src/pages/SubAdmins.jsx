import React, { useState } from "react";
import { useNavigate } from "react-router";
import { FiMoreVertical } from "react-icons/fi";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { useSubAdminManagement } from "../context/SubAdminContext";
import { getModuleLabel } from "../config/subAdminModules";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";

const SubAdmins = () => {
  const navigate = useNavigate();
  const { subadmins, deleteSubAdmin } = useSubAdminManagement();
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Modules</TableHead>
                  <TableHead>Password</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subadmins.map((subadmin) => {
                  const visibleModules = subadmin.modules.slice(0, 3);
                  const hiddenCount = subadmin.modules.length - visibleModules.length;

                  return (
                    <TableRow key={subadmin.id}>
                      <TableCell className="whitespace-nowrap text-sm font-semibold text-slate-800">
                        {subadmin.name}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-slate-600">{subadmin.email}</TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-slate-500">
                        {"•".repeat(Math.max(subadmin.password.length, 6))}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-right">
                        <Popover
                          open={activeMenuId === subadmin.id}
                          onOpenChange={(open) => setActiveMenuId(open ? subadmin.id : null)}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)] p-0 shadow-none"
                              aria-label={`More actions for ${subadmin.name}`}
                            >
                              <FiMoreVertical className="h-6 w-6" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-36 p-1">
                            <button
                              type="button"
                              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm text-slate-600 transition hover:bg-[var(--color-muted)]"
                              onClick={() => {
                                setActiveMenuId(null);
                                navigate(`/sub-admins/${subadmin.id}/edit`);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="mt-1 flex w-full items-center justify-between rounded-md px-3 py-2 text-sm text-rose-600 transition hover:bg-rose-50"
                              onClick={() => handleDeleteRequest(subadmin.id)}
                            >
                              Delete
                            </button>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
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
