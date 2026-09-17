"use client";

import { Card } from "@/components/ui/card";
import { PageHeader, Tabs } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { trips } from "@/data/mock";
import { formatKm, formatRwf } from "@/lib/utils";
import { useMemo, useState } from "react";

export default function RiderTripsPage() {
  const [tab, setTab] = useState("all");
  const myTrips = useMemo(
    () => trips.filter((t) => t.riderName === "Jean Claude" || t.motorcyclePlate === "RAE 428C"),
    [],
  );
  // Show all for richer demo history if filter is thin
  const source = myTrips.length >= 2 ? myTrips : trips;

  const filtered = source.filter((t) => {
    if (tab === "all") return true;
    if (tab === "active") {
      return ["in_progress", "to_pickup", "waiting", "assigned"].includes(t.status);
    }
    return t.status === tab;
  });

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <PageHeader
        title="Trip history"
        description="Your completed and cancelled trips."
      />

      <Tabs
        tabs={[
          { id: "all", label: "All", count: source.length },
          {
            id: "active",
            label: "Active",
            count: source.filter((t) =>
              ["in_progress", "to_pickup", "waiting", "assigned"].includes(t.status),
            ).length,
          },
          {
            id: "completed",
            label: "Done",
            count: source.filter((t) => t.status === "completed").length,
          },
        ]}
        active={tab}
        onChange={setTab}
      />

      <div className="space-y-3">
        {filtered.map((trip) => (
          <Card key={trip.id} padding="md">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-text">{trip.id}</p>
                <p className="text-xs text-text-secondary mt-0.5">
                  {trip.employeeName}
                </p>
              </div>
              <StatusBadge status={trip.status} />
            </div>
            <p className="mt-2 text-sm text-text">
              {trip.pickup} → {trip.destination}
            </p>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-text-muted">
              <span>{formatKm(trip.distanceKm)}</span>
              <span>{formatRwf(trip.cost)}</span>
              {trip.completedAt ? <span>{trip.completedAt}</span> : null}
              {trip.startedAt && !trip.completedAt ? <span>{trip.startedAt}</span> : null}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
