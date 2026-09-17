"use client";

import { Button } from "@/components/ui/button";
import { Card, MetricCard } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { dashboardStats, trips } from "@/data/mock";
import { cn, formatKm, formatRwf } from "@/lib/utils";
import { Download, FileBarChart } from "lucide-react";
import { useMemo, useState } from "react";

const categories = [
  {
    id: "trips",
    title: "Trip activity",
    description: "Completed, cancelled, and in-progress trips",
  },
  {
    id: "fleet",
    title: "Fleet utilization",
    description: "Online rate, distance, and idle time",
  },
  {
    id: "cost",
    title: "Transport cost",
    description: "Spend by department and period",
  },
  {
    id: "incidents",
    title: "Incidents",
    description: "Open alerts and resolution times",
  },
];

export default function ReportsPage() {
  const [category, setCategory] = useState("trips");
  const [from, setFrom] = useState("2026-09-01");
  const [to, setTo] = useState("2026-09-16");
  const [department, setDepartment] = useState("all");

  const rows = useMemo(() => {
    if (category === "trips") return trips;
    return trips.slice(0, 3);
  }, [category]);

  const selected = categories.find((c) => c.id === category)!;

  return (
    <div className="space-y-5 sm:space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        title="Reports"
        description="Operational summaries for trips, fleet, cost, and incidents."
        actions={
          <Button size="sm" leftIcon={<Download className="size-3.5" />}>
            Export
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {categories.map((cat) => {
          const active = cat.id === category;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={cn(
                "text-left rounded-[12px] border p-4 transition-colors",
                active
                  ? "border-primary bg-primary-soft/50 ring-1 ring-primary/20"
                  : "border-border bg-surface hover:bg-surface-muted/60",
              )}
            >
              <div className="flex items-start gap-2">
                <FileBarChart
                  className={cn("size-4 mt-0.5", active ? "text-primary" : "text-text-muted")}
                />
                <div>
                  <p className="text-sm font-semibold text-text">{cat.title}</p>
                  <p className="text-xs text-text-secondary mt-1">{cat.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <Card>
        <h2 className="text-base font-semibold text-text">Filters</h2>
        <p className="text-xs text-text-muted mt-0.5">
          {selected.title} · refine the reporting window
        </p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="From">
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </Field>
          <Field label="To">
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </Field>
          <Field label="Department">
            <Select value={department} onChange={(e) => setDepartment(e.target.value)}>
              <option value="all">All departments</option>
              <option value="Operations">Operations</option>
              <option value="Finance">Finance</option>
              <option value="HR">HR</option>
              <option value="Sales">Sales</option>
            </Select>
          </Field>
        </div>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard label="Trips today" value={dashboardStats.tripsToday} accent="primary" />
        <MetricCard
          label="Completed"
          value={dashboardStats.completedToday}
          accent="success"
        />
        <MetricCard label="Distance" value={formatKm(dashboardStats.distanceTodayKm)} />
        <MetricCard
          label="Transport cost"
          value={formatRwf(dashboardStats.transportCostToday)}
        />
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-text">{selected.title} report</h2>
            <p className="text-xs text-text-muted mt-0.5">
              {from} → {to}
              {department !== "all" ? ` · ${department}` : ""}
            </p>
          </div>
          <Button variant="secondary" size="sm" leftIcon={<Download className="size-3.5" />}>
            Export CSV
          </Button>
        </div>

        <ul className="md:hidden divide-y divide-border">
          {rows.map((trip) => (
            <li key={trip.id} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-text">{trip.id}</p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {trip.pickup} → {trip.destination}
                  </p>
                </div>
                <StatusBadge status={trip.status} />
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-text-secondary">
                <span>{trip.riderName}</span>
                <span>{formatRwf(trip.cost)}</span>
                <span>{formatKm(trip.distanceKm)}</span>
                <span>{trip.employeeName}</span>
              </div>
            </li>
          ))}
        </ul>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted/50 text-left text-xs uppercase tracking-wide text-text-muted">
                <th className="px-4 py-3 font-medium">Trip</th>
                <th className="px-4 py-3 font-medium">Employee</th>
                <th className="px-4 py-3 font-medium">Rider</th>
                <th className="px-4 py-3 font-medium">Route</th>
                <th className="px-4 py-3 font-medium">Distance</th>
                <th className="px-4 py-3 font-medium">Cost</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((trip) => (
                <tr key={trip.id} className="hover:bg-surface-muted/40">
                  <td className="px-4 py-3 font-medium text-text">{trip.id}</td>
                  <td className="px-4 py-3 text-text-secondary">{trip.employeeName}</td>
                  <td className="px-4 py-3 text-text-secondary">{trip.riderName}</td>
                  <td className="px-4 py-3 text-text-secondary">
                    {trip.pickup} → {trip.destination}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {formatKm(trip.distanceKm)}
                  </td>
                  <td className="px-4 py-3 font-medium text-text">{formatRwf(trip.cost)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={trip.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
