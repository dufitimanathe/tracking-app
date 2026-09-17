"use client";

import { Card } from "@/components/ui/card";
import { DataTable, type DataColumn } from "@/components/ui/data-table";
import { SearchInput } from "@/components/ui/input";
import { PageHeader, Tabs } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { trips } from "@/data/mock";
import { formatKm, formatRwf } from "@/lib/utils";
import type { Trip } from "@/types";
import { useMemo, useState } from "react";

export default function SupervisorTripsPage() {
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return trips.filter((t) => {
      const matchTab =
        tab === "all"
          ? true
          : tab === "active"
            ? ["in_progress", "to_pickup", "waiting", "assigned"].includes(t.status)
            : t.status === tab;
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.employeeName.toLowerCase().includes(q) ||
        t.riderName.toLowerCase().includes(q) ||
        t.motorcyclePlate.toLowerCase().includes(q);
      return matchTab && matchQuery;
    });
  }, [tab, query]);

  const columns: DataColumn<Trip>[] = [
    {
      key: "id",
      header: "Trip",
      render: (t) => (
        <div>
          <p className="font-medium text-text">{t.id}</p>
          <p className="text-xs text-text-muted sm:hidden">
            {t.pickup} → {t.destination}
          </p>
        </div>
      ),
    },
    {
      key: "route",
      header: "Route",
      hideOnMobile: true,
      render: (t) => (
        <span className="text-text-secondary">
          {t.pickup} → {t.destination}
        </span>
      ),
    },
    {
      key: "rider",
      header: "Rider",
      render: (t) => (
        <div>
          <p>{t.riderName}</p>
          <p className="text-xs text-text-muted">{t.motorcyclePlate}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (t) => <StatusBadge status={t.status} />,
    },
    {
      key: "distance",
      header: "Distance",
      hideOnMobile: true,
      render: (t) => formatKm(t.distanceKm),
    },
    {
      key: "cost",
      header: "Cost",
      hideOnMobile: true,
      render: (t) => formatRwf(t.cost),
    },
  ];

  return (
    <div className="max-w-[1200px] mx-auto space-y-4">
      <PageHeader
        title="Trips"
        description="Completed and historical trips for your supervised employees."
      />

      <Card padding="none" className="overflow-hidden">
        <div className="px-4 pt-3">
          <Tabs
            tabs={[
              { id: "all", label: "All", count: trips.length },
              {
                id: "active",
                label: "Active",
                count: trips.filter((t) =>
                  ["in_progress", "to_pickup", "waiting", "assigned"].includes(
                    t.status,
                  ),
                ).length,
              },
              {
                id: "completed",
                label: "Completed",
                count: trips.filter((t) => t.status === "completed").length,
              },
              {
                id: "cancelled",
                label: "Cancelled",
                count: trips.filter((t) => t.status === "cancelled").length,
              },
            ]}
            active={tab}
            onChange={setTab}
          />
        </div>
        <div className="p-4 border-b border-border">
          <SearchInput
            placeholder="Search trip, employee, rider, plate..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <DataTable
          columns={columns}
          rows={filtered}
          rowKey={(t) => t.id}
        />
      </Card>
    </div>
  );
}
