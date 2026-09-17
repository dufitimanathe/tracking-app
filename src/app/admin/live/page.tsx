"use client";

import { FleetLegend, OpsMap } from "@/components/maps/ops-map";
import { Button } from "@/components/ui/button";
import { Card, MetricCard } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/input";
import {
  LiveIndicator,
  PageHeader,
  Tabs,
} from "@/components/ui/page-header";
import { Drawer, Avatar } from "@/components/ui/overlay";
import { StatusBadge } from "@/components/ui/status-badge";
import { liveFleetStats, motorcycles } from "@/data/mock";
import { cn, formatKm, initials } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import { setSelectedMotorcycleId } from "@/store/slices/ui-slice";
import type { FleetStatus, Motorcycle } from "@/types";
import {
  AlertTriangle,
  Bike,
  CircleOff,
  MapPin,
  Navigation,
  Radio,
  User,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type FleetFilter =
  | "all"
  | "available"
  | "assigned"
  | "on_trip"
  | "offline"
  | "incidents";

const filterTabs: { id: FleetFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "available", label: "Available" },
  { id: "assigned", label: "Assigned" },
  { id: "on_trip", label: "On Trip" },
  { id: "offline", label: "Offline" },
  { id: "incidents", label: "Incidents" },
];

function matchesFilter(m: Motorcycle, filter: FleetFilter) {
  if (filter === "all") return true;
  if (filter === "incidents") return m.status === "unauthorized";
  return m.status === filter;
}

export default function LiveOperationsPage() {
  const dispatch = useAppDispatch();
  const selectedId = useAppSelector((s) => s.ui.selectedMotorcycleId);
  const [filter, setFilter] = useState<FleetFilter>("all");
  const [query, setQuery] = useState("");
  const [mobileView, setMobileView] = useState<"map" | "list">("map");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const selected = motorcycles.find((m) => m.id === selectedId) ?? null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return motorcycles.filter((m) => {
      if (!matchesFilter(m, filter)) return false;
      if (!q) return true;
      return (
        m.plate.toLowerCase().includes(q) ||
        m.fleetNumber.toLowerCase().includes(q) ||
        (m.riderName?.toLowerCase().includes(q) ?? false) ||
        m.location.toLowerCase().includes(q)
      );
    });
  }, [filter, query]);

  function selectMotorcycle(m: Motorcycle) {
    dispatch(setSelectedMotorcycleId(m.id));
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    dispatch(setSelectedMotorcycleId(null));
  }

  const stats = [
    {
      label: "Online",
      value: liveFleetStats.online,
      accent: "success" as const,
      icon: <Radio className="size-4" />,
    },
    {
      label: "Moving",
      value: liveFleetStats.moving,
      accent: "primary" as const,
      icon: <Navigation className="size-4" />,
    },
    {
      label: "Available",
      value: liveFleetStats.available,
      accent: "success" as const,
      icon: <Bike className="size-4" />,
    },
    {
      label: "On Trip",
      value: liveFleetStats.onTrip,
      accent: "primary" as const,
      icon: <MapPin className="size-4" />,
    },
    {
      label: "Offline",
      value: liveFleetStats.offline,
      accent: "none" as const,
      icon: <CircleOff className="size-4" />,
    },
    {
      label: "Incidents",
      value: liveFleetStats.incidents,
      accent: "danger" as const,
      icon: <AlertTriangle className="size-4" />,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-5 max-w-[1600px] mx-auto">
      <PageHeader
        title="Live Operations"
        description="Real-time fleet command center across Kigali"
        actions={<LiveIndicator />}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {stats.map((s) => (
          <MetricCard
            key={s.label}
            label={s.label}
            value={s.value}
            accent={s.accent}
            icon={s.icon}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          tabs={filterTabs.map((t) => ({
            ...t,
            count:
              t.id === "all"
                ? motorcycles.length
                : motorcycles.filter((m) => matchesFilter(m, t.id)).length,
          }))}
          active={filter}
          onChange={(id) => setFilter(id as FleetFilter)}
          className="flex-1"
        />
        <SearchInput
          placeholder="Search plate, rider, location…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full sm:w-72 shrink-0"
        />
      </div>

      {/* Mobile map/list switcher */}
      <div className="flex gap-1 rounded-[10px] border border-border bg-surface p-1 lg:hidden">
        {(["map", "list"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setMobileView(v)}
            className={cn(
              "flex-1 rounded-[8px] py-2 text-sm font-medium capitalize transition-colors",
              mobileView === v
                ? "bg-primary-soft text-primary"
                : "text-text-secondary hover:text-text",
            )}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card
          className={cn(
            "lg:col-span-3 p-0 overflow-hidden",
            mobileView === "list" && "hidden lg:block",
          )}
          padding="none"
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border">
            <div>
              <h2 className="text-sm font-semibold text-text">Fleet map</h2>
              <p className="text-xs text-text-muted mt-0.5">
                {filtered.length} unit{filtered.length === 1 ? "" : "s"} shown
              </p>
            </div>
            <FleetLegend className="hidden sm:flex" />
          </div>
          <div className="p-3 sm:p-4">
            <OpsMap
              motorcycles={filtered}
              selectedId={selectedId}
              onSelect={selectMotorcycle}
              className="h-[320px] sm:h-[480px] lg:h-[560px]"
            />
            <FleetLegend className="mt-3 sm:hidden" />
          </div>
        </Card>

        <Card
          className={cn(
            "lg:col-span-2 p-0 overflow-hidden flex flex-col",
            mobileView === "map" && "hidden lg:flex",
          )}
          padding="none"
        >
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-sm font-semibold text-text">Fleet list</h2>
            <p className="text-xs text-text-muted mt-0.5">
              Tap a unit for details and actions
            </p>
          </div>
          <ul className="divide-y divide-border overflow-y-auto panel-scroll max-h-[480px] lg:max-h-[600px]">
            {filtered.length === 0 ? (
              <li className="px-4 py-10 text-center text-sm text-text-muted">
                No motorcycles match this filter.
              </li>
            ) : (
              filtered.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => selectMotorcycle(m)}
                    className={cn(
                      "w-full text-left px-4 py-3 transition-colors hover:bg-surface-muted/70",
                      selectedId === m.id && "bg-primary-soft/50",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-text">
                          {m.plate}
                        </p>
                        <p className="text-xs text-text-secondary mt-0.5 truncate">
                          {m.riderName ?? "Unassigned"} · {m.fleetNumber}
                        </p>
                      </div>
                      <StatusBadge
                        status={
                          m.status === "unauthorized"
                            ? "unauthorized"
                            : (m.status as FleetStatus)
                        }
                      />
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-text-secondary">
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="size-3 shrink-0" />
                        {m.location}
                      </span>
                      <span className="text-right">
                        {m.speed > 0 ? `${m.speed} km/h` : "Stopped"}
                      </span>
                      <span className="col-span-2 text-text-muted">
                        {m.lastSeen}
                      </span>
                    </div>
                  </button>
                </li>
              ))
            )}
          </ul>
        </Card>
      </div>

      <Drawer
        open={drawerOpen && !!selected}
        onClose={closeDrawer}
        title={selected?.plate ?? ""}
        subtitle={
          selected
            ? `${selected.fleetNumber} · ${selected.brand} ${selected.model}`
            : undefined
        }
        footer={
          selected ? (
            <>
              <Button variant="secondary" size="sm" onClick={closeDrawer}>
                Close
              </Button>
              <Link
                href={`/admin/fleet/${selected.id}`}
                className="inline-flex h-8 items-center justify-center rounded-[8px] border border-border bg-surface px-3 text-xs font-medium text-text hover:bg-surface-muted"
              >
                Full profile
              </Link>
              <Button size="sm">Message rider</Button>
            </>
          ) : null
        }
      >
        {selected ? (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Avatar
                initials={initials(selected.riderName ?? selected.plate)}
                size="lg"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text">
                  {selected.riderName ?? "No rider assigned"}
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  GPS · {selected.gpsStatus}
                </p>
              </div>
              <StatusBadge
                status={
                  selected.status === "unauthorized"
                    ? "unauthorized"
                    : selected.status
                }
                className="ml-auto"
              />
            </div>

            <dl className="grid grid-cols-2 gap-3 text-sm">
              <Detail label="Location" value={selected.location} />
              <Detail
                label="Speed"
                value={
                  selected.speed > 0 ? `${selected.speed} km/h` : "Stopped"
                }
              />
              <Detail label="Trips today" value={String(selected.tripsToday)} />
              <Detail
                label="Distance today"
                value={formatKm(selected.distanceTodayKm)}
              />
              <Detail label="Last update" value={selected.lastSeen} />
              <Detail label="Color" value={selected.color} />
            </dl>

            <div className="rounded-[10px] border border-border bg-surface-muted/40 p-3 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                Quick actions
              </p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="secondary" leftIcon={<User className="size-3.5" />}>
                  Reassign rider
                </Button>
                <Button size="sm" variant="secondary" leftIcon={<MapPin className="size-3.5" />}>
                  Center on map
                </Button>
                {selected.status === "unauthorized" ? (
                  <Button size="sm" variant="danger-outline">
                    Open incident
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] border border-border px-3 py-2">
      <dt className="text-[11px] uppercase tracking-wide text-text-muted">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm font-medium text-text">{value}</dd>
    </div>
  );
}
