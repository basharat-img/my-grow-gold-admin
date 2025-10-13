import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

const segments = [
  { name: "Enterprise", share: "42%", growth: "+6.4%" },
  { name: "SMB", share: "37%", growth: "+4.8%" },
  { name: "Creator", share: "21%", growth: "+8.1%" },
];

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Insights</p>
        <h1 className="text-3xl font-semibold text-slate-900">Growth Analytics</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Understand how Grow Gold initiatives are performing across customer segments, channels, and experiments. Update
          parameters in your data studio and they will reflect in this view instantly.
        </p>
      </div>
      <div className="grid gap-5 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>Acquisition Channels</CardTitle>
            <CardDescription>Contribution of each channel this quarter</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Influencer", "Paid Search", "Partnerships", "Organic"].map((label, index) => {
                const progress = [78, 64, 58, 49][index];
                return (
                  <div key={label} className="space-y-2">
                    <div className="flex items-center justify-between text-sm font-medium text-slate-600">
                      <span>{label}</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--color-muted)]">
                      <div
                        className="h-full rounded-full bg-[var(--color-primary)] transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Segment Share</CardTitle>
            <CardDescription>Quarterly distribution across primary segments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {segments.map((segment) => (
                <div key={segment.name} className="flex items-center justify-between rounded-lg border border-[var(--color-border)] px-4 py-3">
                  <div>
                    <p className="font-semibold text-slate-800">{segment.name}</p>
                    <p className="text-xs text-slate-500">Growth: {segment.growth}</p>
                  </div>
                  <span className="text-sm font-semibold text-indigo-600">{segment.share}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
