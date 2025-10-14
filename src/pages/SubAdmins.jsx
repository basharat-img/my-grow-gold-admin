import React from "react";
import { FiEdit2, FiEye, FiPlus, FiShield, FiTrash2 } from "react-icons/fi";
import { HiDotsVertical } from "react-icons/hi";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { cn } from "../lib/utils";

const subAdmins = [
  {
    id: 1,
    name: "Priya Sharma",
    email: "priya.sharma@growgold.com",
    role: "Lifecycle Operations",
    status: "Active",
    createdAt: "Jan 02, 2025",
    lastActive: "4 minutes ago",
  },
  {
    id: 2,
    name: "Rafael Mendes",
    email: "rafael.mendes@growgold.com",
    role: "Finance Oversight",
    status: "Invited",
    createdAt: "Dec 18, 2024",
    lastActive: "Pending invite",
  },
  {
    id: 3,
    name: "Amelia Wright",
    email: "amelia.wright@growgold.com",
    role: "Partner Success",
    status: "Active",
    createdAt: "Nov 29, 2024",
    lastActive: "1 hour ago",
  },
  {
    id: 4,
    name: "Sanjay Kumar",
    email: "sanjay.kumar@growgold.com",
    role: "Compliance",
    status: "Suspended",
    createdAt: "Oct 11, 2024",
    lastActive: "2 weeks ago",
  },
];

const statusStyles = {
  Active: "bg-emerald-100 text-emerald-600",
  Invited: "bg-indigo-100 text-indigo-600",
  Suspended: "bg-rose-100 text-rose-600",
};

const SubAdmins = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Administration</p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900">Sub-admin Directory</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Manage delegated access across the Grow Gold admin surface. Track who has access, when they last authenticated, and
            which workspace they steward.
          </p>
        </div>
        <Button className="inline-flex items-center space-x-2 self-start">
          <FiPlus className="h-4 w-4" />
          <span>Invite sub-admin</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active access list</CardTitle>
          <CardDescription>Every sub-admin currently provisioned for Grow Gold.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last active</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-12 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subAdmins.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium text-slate-900">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600">{member.role}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                        statusStyles[member.status] ?? "bg-slate-200 text-slate-600",
                      )}
                    >
                      {member.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-600">{member.lastActive}</TableCell>
                  <TableCell className="text-slate-600">{member.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <Popover className="flex w-full justify-end">
                      <PopoverTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] text-slate-500 transition-colors hover:text-slate-800">
                        <HiDotsVertical className="h-4 w-4" />
                        <span className="sr-only">Open actions</span>
                      </PopoverTrigger>
                      <PopoverContent align="end" className="w-44 space-y-1 p-2">
                        <button
                          type="button"
                          className="flex w-full items-center space-x-2 rounded-md px-3 py-2 text-left text-sm text-slate-600 transition-colors hover:bg-[var(--color-muted)] hover:text-slate-800"
                        >
                          <FiEye className="h-4 w-4" />
                          <span>View profile</span>
                        </button>
                        <button
                          type="button"
                          className="flex w-full items-center space-x-2 rounded-md px-3 py-2 text-left text-sm text-slate-600 transition-colors hover:bg-[var(--color-muted)] hover:text-slate-800"
                        >
                          <FiEdit2 className="h-4 w-4" />
                          <span>Edit access</span>
                        </button>
                        <button
                          type="button"
                          className="flex w-full items-center space-x-2 rounded-md px-3 py-2 text-left text-sm text-rose-600 transition-colors hover:bg-rose-50"
                        >
                          <FiTrash2 className="h-4 w-4" />
                          <span>Revoke access</span>
                        </button>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-dashed border-[var(--color-border)] bg-[var(--color-muted)]/40">
        <CardContent className="flex flex-col items-start gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Need an audit trail?</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">Compliance reporting is live.</h2>
            <p className="mt-2 text-sm text-slate-500">
              Export access history with one click and stay aligned with your governance policy.
            </p>
          </div>
          <Button variant="outline" className="inline-flex items-center space-x-2">
            <FiShield className="h-4 w-4" />
            <span>Generate report</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubAdmins;
