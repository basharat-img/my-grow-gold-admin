import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

const members = [
  { name: "Anya Patel", role: "Growth Architect", focus: "Lifecycle" },
  { name: "Daniel Cho", role: "Acquisition Lead", focus: "Paid Search" },
  { name: "Maya Singh", role: "Partner Success", focus: "Alliances" },
  { name: "Ibrahim Khan", role: "Data Strategist", focus: "Attribution" },
];

const Team = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Crew</p>
        <h1 className="text-3xl font-semibold text-slate-900">Growth Enablement Team</h1>
        <p className="text-sm text-slate-500">
          Your Grow Gold partners driving the global roadmap. Tap a profile to open a dedicated workspace.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {members.map((member) => (
          <Card key={member.name} className="hover:border-[var(--color-primary)] transition-colors">
            <CardHeader>
              <CardTitle className="text-xl">{member.name}</CardTitle>
              <CardDescription>{member.role}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">Focus: {member.focus}</p>
              <div className="mt-4 flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Available</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Team;
