"use client";

import { Card, MetricCard } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Avatar } from "@/components/ui/overlay";
import { riders } from "@/data/mock";
import { initials } from "@/lib/utils";
import { UserRound, Users } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function RidersPage() {
  const [query, setQuery] = useState("");

  const kpis = useMemo(() => {
    const total = riders.length;
    const available = riders.filter((r) => r.availability === "available").length;
    const onTrip = riders.filter(
      (r) => r.availability === "on_trip" || r.availability === "to_pickup",
    ).length;
    const offline = riders.filter((r) => r.availability === "offline").length;
    const suspended = riders.filter((r) => r.availability === "suspended").length;
    return { total, available, onTrip, offline, suspended };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return riders;
    return riders.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q) ||
        r.motorcyclePlate?.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="space-y-5 sm:space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        title="Riders"
        description="Manage rider availability, assignments, and performance."
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <MetricCard label="Total" value={kpis.total} icon={<Users className="size-4" />} />
        <MetricCard
          label="Available"
          value={kpis.available}
          accent="success"
          hint="Ready to assign"
        />
        <MetricCard
          label="On Trip"
          value={kpis.onTrip}
          accent="primary"
          hint="Active assignments"
        />
        <MetricCard label="Offline" value={kpis.offline} hint="Not connected" />
        <MetricCard
          label="Suspended"
          value={kpis.suspended}
          accent="danger"
          hint="Restricted"
          className="col-span-2 sm:col-span-1"
        />
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 py-3 border-b border-border">
          <div>
            <h2 className="text-base font-semibold text-text">All riders</h2>
            <p className="text-xs text-text-muted mt-0.5">
              {filtered.length} of {riders.length} shown
            </p>
          </div>
          <SearchInput
            placeholder="Search name, phone, plate…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:w-72"
          />
        </div>

        {/* Mobile cards */}
        <ul className="md:hidden divide-y divide-border">
          {filtered.map((rider) => (
            <li key={rider.id} className="p-4">
              <div className="flex items-start gap-3">
                <Avatar initials={initials(rider.name)} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-text">{rider.name}</p>
                      <p className="text-xs text-text-secondary mt-0.5">{rider.phone}</p>
                    </div>
                    <StatusBadge status={rider.availability} />
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-text-secondary">
                    <span>{rider.motorcyclePlate ?? "Unassigned"}</span>
                    <span>{rider.location}</span>
                    <span>{rider.tripsToday} trips today</span>
                    <span>{rider.rating.toFixed(1)} ★</span>
                  </div>
                  <Link
                    href={`/admin/riders/${rider.id}`}
                    className="mt-3 inline-flex text-xs font-medium text-primary"
                  >
                    View profile
                  </Link>
                </div>
              </div>
            </li>
          ))}
          {filtered.length === 0 ? (
            <li className="px-4 py-10 text-center text-sm text-text-muted">
              No riders match your search.
            </li>
          ) : null}
        </ul>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted/50 text-left text-xs uppercase tracking-wide text-text-muted">
                <th className="px-4 py-3 font-medium">Rider</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Motorcycle</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Trips</th>
                <th className="px-4 py-3 font-medium">Rating</th>
                <th className="px-4 py-3 font-medium">Last active</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((rider) => (
                <tr key={rider.id} className="hover:bg-surface-muted/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar initials={initials(rider.name)} size="sm" />
                      <div>
                        <p className="font-medium text-text">{rider.name}</p>
                        <p className="text-xs text-text-muted">{rider.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={rider.availability} />
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {rider.motorcyclePlate ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{rider.location}</td>
                  <td className="px-4 py-3 text-text-secondary">{rider.tripsToday}</td>
                  <td className="px-4 py-3 text-text-secondary">
                    {rider.rating.toFixed(1)}
                  </td>
                  <td className="px-4 py-3 text-text-muted">{rider.lastActive}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/riders/${rider.id}`}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-text-muted">
                    <div className="inline-flex flex-col items-center gap-2">
                      <UserRound className="size-5 text-text-muted" />
                      No riders match your search.
                    </div>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
