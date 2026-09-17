"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchInput, Select } from "@/components/ui/input";
import {
  EmptyState,
  PageHeader,
} from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { motorcycles } from "@/data/mock";
import { formatKm } from "@/lib/utils";
import type { FleetStatus } from "@/types";
import { Bike, Plus } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type StatusFilter = "all" | FleetStatus;

export default function FleetPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [gps, setGps] = useState<"all" | "online" | "delayed" | "offline">(
    "all",
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return motorcycles.filter((m) => {
      if (status !== "all" && m.status !== status) return false;
      if (gps !== "all" && m.gpsStatus !== gps) return false;
      if (!q) return true;
      return (
        m.plate.toLowerCase().includes(q) ||
        m.fleetNumber.toLowerCase().includes(q) ||
        m.brand.toLowerCase().includes(q) ||
        m.model.toLowerCase().includes(q) ||
        (m.riderName?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [query, status, gps]);

  return (
    <div className="space-y-4 sm:space-y-5 max-w-[1400px] mx-auto">
      <PageHeader
        title="Fleet"
        description="Manage company motorcycles, GPS units, and assignments"
        actions={
          <Link href="/admin/fleet/new">
            <Button size="sm" leftIcon={<Plus className="size-3.5" />}>
              Add Motorcycle
            </Button>
          </Link>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          placeholder="Search plate, fleet #, rider…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full sm:flex-1 sm:max-w-sm"
        />
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value as StatusFilter)}
          className="w-full sm:w-44"
        >
          <option value="all">All statuses</option>
          <option value="available">Available</option>
          <option value="assigned">Assigned</option>
          <option value="on_trip">On Trip</option>
          <option value="offline">Offline</option>
          <option value="maintenance">Maintenance</option>
          <option value="unauthorized">Unauthorized</option>
        </Select>
        <Select
          value={gps}
          onChange={(e) =>
            setGps(e.target.value as "all" | "online" | "delayed" | "offline")
          }
          className="w-full sm:w-40"
        >
          <option value="all">All GPS</option>
          <option value="online">Online</option>
          <option value="delayed">Delayed</option>
          <option value="offline">Offline</option>
        </Select>
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted/40 text-left text-xs uppercase tracking-wide text-text-muted">
                <th className="px-4 py-3 font-medium">Motorcycle</th>
                <th className="px-4 py-3 font-medium">Specs</th>
                <th className="px-4 py-3 font-medium">Rider</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Today</th>
                <th className="px-4 py-3 font-medium">GPS</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((m) => (
                <tr
                  key={m.id}
                  className="hover:bg-surface-muted/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/fleet/${m.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {m.plate}
                    </Link>
                    <p className="text-xs text-text-muted mt-0.5">
                      {m.fleetNumber}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {m.brand} {m.model}
                    <p className="text-xs text-text-muted">
                      {m.year} · {m.color}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-text">
                    {m.riderName ?? (
                      <span className="text-text-muted">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {m.location}
                    <p className="text-xs text-text-muted">{m.lastSeen}</p>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {m.tripsToday} trips
                    <p className="text-xs text-text-muted">
                      {formatKm(m.distanceTodayKm)}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={
                        m.gpsStatus === "offline"
                          ? "gps_offline"
                          : m.gpsStatus === "delayed"
                            ? "delayed"
                            : "online"
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={
                        m.status === "unauthorized"
                          ? "unauthorized"
                          : m.status
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="md:hidden divide-y divide-border">
          {filtered.map((m) => (
            <li key={m.id}>
              <Link
                href={`/admin/fleet/${m.id}`}
                className="block px-4 py-3 hover:bg-surface-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-primary">
                      {m.plate}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {m.fleetNumber} · {m.brand} {m.model}
                    </p>
                  </div>
                  <StatusBadge
                    status={
                      m.status === "unauthorized" ? "unauthorized" : m.status
                    }
                  />
                </div>
                <p className="mt-2 text-xs text-text-secondary">
                  {m.riderName ?? "Unassigned"} · {m.location}
                </p>
                <div className="mt-2 flex items-center justify-between text-xs text-text-muted">
                  <span>
                    {m.tripsToday} trips · {formatKm(m.distanceTodayKm)}
                  </span>
                  <StatusBadge
                    status={
                      m.gpsStatus === "offline"
                        ? "gps_offline"
                        : m.gpsStatus === "delayed"
                          ? "delayed"
                          : "online"
                    }
                    showDot={false}
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Bike className="size-5" />}
            title="No motorcycles"
            description="No fleet units match your search or filters."
            action={
              <Link href="/admin/fleet/new">
                <Button size="sm" leftIcon={<Plus className="size-3.5" />}>
                  Add Motorcycle
                </Button>
              </Link>
            }
          />
        ) : null}
      </Card>
    </div>
  );
}
