import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

const performance = [
  { label: "Monthly Revenue", value: "$128K", change: "+12.4%" },
  { label: "New Leads", value: "892", change: "+5.2%" },
  { label: "Conversion", value: "4.3%", change: "+1.2%" },
];

const campaigns = [
  { name: "Autumn Uplift", status: "Active", growth: "+8.5%" },
  { name: "Harvest Prime", status: "In Review", growth: "+3.4%" },
  { name: "Referral Boost", status: "Active", growth: "+11.2%" },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Welcome back</p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900">Grow Gold Intelligence</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Track performance across the Grow Gold ecosystem in real time. Metrics refresh every 15 minutes and draw from live
            partner streams.
          </p>
        </div>
        <Button className="self-start">Generate Report</Button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {performance.map((item) => (
          <Card key={item.label} className="relative overflow-hidden">
            <CardHeader>
              <CardDescription>{item.label}</CardDescription>
              <CardTitle className="text-3xl">{item.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-emerald-600">{item.change} vs last cycle</p>
            </CardContent>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[var(--color-primary)]/20 via-[var(--color-primary)]/60 to-[var(--color-primary)]" />
          </Card>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>Revenue Momentum</CardTitle>
            <CardDescription>Overview of last six months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-2">
              {[45, 70, 68, 92, 86, 110].map((bar, index) => (
                <div key={index} className="flex flex-col items-center justify-end space-y-2">
                  <div
                    className="w-full rounded-t-lg bg-[var(--color-primary)]"
                    style={{ height: `${bar}px`, minHeight: "3rem" }}
                  />
                  <span className="text-xs font-medium text-slate-500">Q{index + 1}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Campaign Signals</CardTitle>
            <CardDescription>Live performance across active campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div key={campaign.name} className="flex items-center justify-between rounded-lg border border-[var(--color-border)] px-4 py-3">
                  <div>
                    <p className="font-semibold text-slate-800">{campaign.name}</p>
                    <p className="text-xs text-slate-500">Status: {campaign.status}</p>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600">{campaign.growth}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
