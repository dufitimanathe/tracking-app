"use client";

import { Card } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/input";
import {
  EmptyState,
  PageHeader,
  Tabs,
} from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { trips } from "@/data/mock";
import { formatKm, formatRwf } from "@/lib/utils";
import type { TripStatus } from "@/types";
import { Route } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type TripTab = "all" | TripStatus;

const tabs: { id: TripTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "to_pickup", label: "To Pickup" },
  { id: "in_progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

export default function TripsPage() {
  const [tab, setTab] = useState<TripTab>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return trips.filter((t) => {
      if (tab !== "all" && t.status !== tab) return false;
      if (!q) return true;
      return (
        t.id.toLowerCase().includes(q) ||
        t.employeeName.toLowerCase().includes(q) ||
        t.riderName.toLowerCase().includes(q) ||
        t.motorcyclePlate.toLowerCase().includes(q) ||
        t.pickup.toLowerCase().includes(q) ||
        t.destination.toLowerCase().includes(q)
      );
    });
  }, [tab, query]);

  return (
    <div className="space-y-4 sm:space-y-5 max-w-[1400px] mx-auto">
      <PageHeader
        title="Trips"
        description="Active and historical employee transport trips"
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          tabs={tabs.map((t) => ({
            ...t,
            count:
              t.id === "all"
                ? trips.length
                : trips.filter((tr) => tr.status === t.id).length,
          }))}
          active={tab}
          onChange={(id) => setTab(id as TripTab)}
        />
        <SearchInput
          placeholder="Search trip, rider, plate…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full sm:w-72"
        />
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted/40 text-left text-xs uppercase tracking-wide text-text-muted">
                <th className="px-4 py-3 font-medium">Trip</th>
                <th className="px-4 py-3 font-medium">Employee</th>
                <th className="px-4 py-3 font-medium">Rider / Bike</th>
                <th className="px-4 py-3 font-medium">Route</th>
                <th className="px-4 py-3 font-medium">Distance</th>
                <th className="px-4 py-3 font-medium">Fare</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-surface-muted/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/trips/${t.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {t.id}
                    </Link>
                    {t.etaMin != null &&
                    (t.status === "in_progress" || t.status === "to_pickup") ? (
                      <p className="text-xs text-text-muted mt-0.5">
                        ETA {t.etaMin} min
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-text">{t.employeeName}</td>
                  <td className="px-4 py-3">
                    <p className="text-text">{t.riderName}</p>
                    <p className="text-xs text-text-muted">
                      {t.motorcyclePlate}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {t.pickup} → {t.destination}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {t.distanceKm > 0 ? formatKm(t.distanceKm) : "—"}
                  </td>
                  <td className="px-4 py-3 font-medium text-text">
                    {t.cost > 0 ? formatRwf(t.cost) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={t.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="md:hidden divide-y divide-border">
          {filtered.map((t) => (
            <li key={t.id}>
              <Link
                href={`/admin/trips/${t.id}`}
                className="block px-4 py-3 hover:bg-surface-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-primary">{t.id}</p>
                    <p className="text-sm text-text mt-0.5">{t.employeeName}</p>
                  </div>
                  <StatusBadge status={t.status} />
                </div>
                <p className="mt-2 text-xs text-text-secondary">
                  {t.pickup} → {t.destination}
                </p>
                <div className="mt-2 flex items-center justify-between text-xs text-text-muted">
                  <span>
                    {t.riderName} · {t.motorcyclePlate}
                  </span>
                  <span className="font-medium text-text">
                    {t.cost > 0 ? formatRwf(t.cost) : "—"}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Route className="size-5" />}
            title="No trips"
            description="No trips match this filter or search."
          />
        ) : null}
      </Card>
    </div>
  );
}
