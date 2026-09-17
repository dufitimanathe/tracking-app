"use client";

import { OpsMap } from "@/components/maps/ops-map";
import { Button } from "@/components/ui/button";
import { Card, MetricCard } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Avatar, Timeline } from "@/components/ui/overlay";
import { StatusBadge } from "@/components/ui/status-badge";
import { motorcycles, riders, trips } from "@/data/mock";
import { formatKm, initials } from "@/lib/utils";
import {
  ArrowLeft,
  Bike,
  MapPin,
  Route,
  UserMinus,
  UserPlus,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";

const assignmentHistory = [
  {
    rider: "Jean Claude",
    from: "1 Sep 2026",
    to: "Present",
    note: "Primary rider",
  },
  {
    rider: "Eric N.",
    from: "12 Jul 2026",
    to: "31 Aug 2026",
    note: "Coverage during leave",
  },
  {
    rider: "Unassigned",
    from: "1 Jun 2026",
    to: "11 Jul 2026",
    note: "Depot storage",
  },
];

export default function MotorcycleDetailPage() {
  const params = useParams<{ id: string }>();
  const moto = motorcycles.find((m) => m.id === params.id);

  const rider = useMemo(
    () => riders.find((r) => r.id === moto?.riderId),
    [moto],
  );

  const relatedTrips = useMemo(() => {
    if (!moto) return [];
    return trips.filter((t) => t.motorcyclePlate === moto.plate).slice(0, 4);
  }, [moto]);

  if (!moto) {
    return (
      <div className="max-w-[1400px] mx-auto py-16 text-center space-y-3">
        <h1 className="text-xl font-semibold text-text">Motorcycle not found</h1>
        <p className="text-sm text-text-secondary">
          No unit matches <span className="font-medium">{params.id}</span>.
        </p>
        <Link
          href="/admin/fleet"
          className="inline-flex h-10 items-center rounded-[8px] border border-border bg-surface px-4 text-sm font-medium text-text hover:bg-surface-muted"
        >
          Back to fleet
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5 max-w-[1400px] mx-auto">
      <PageHeader
        title={moto.plate}
        description={`${moto.fleetNumber} · ${moto.brand} ${moto.model} (${moto.year})`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge
              status={
                moto.status === "unauthorized" ? "unauthorized" : moto.status
              }
            />
            <Link
              href="/admin/fleet"
              className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-border bg-surface px-3 text-xs font-medium text-text hover:bg-surface-muted"
            >
              <ArrowLeft className="size-3.5" />
              Fleet
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          label="Trips today"
          value={moto.tripsToday}
          accent="primary"
          icon={<Route className="size-4" />}
        />
        <MetricCard
          label="Distance today"
          value={formatKm(moto.distanceTodayKm)}
          icon={<MapPin className="size-4" />}
        />
        <MetricCard
          label="Speed"
          value={moto.speed > 0 ? `${moto.speed} km/h` : "Stopped"}
        />
        <MetricCard
          label="GPS"
          value={moto.gpsStatus}
          accent={
            moto.gpsStatus === "online"
              ? "success"
              : moto.gpsStatus === "delayed"
                ? "warning"
                : "danger"
          }
          icon={<Bike className="size-4" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 space-y-4">
          <Card className="p-0 overflow-hidden" padding="none">
            <div className="px-4 py-3 border-b border-border">
              <h2 className="text-sm font-semibold text-text">Live position</h2>
              <p className="text-xs text-text-muted mt-0.5">
                {moto.location} · {moto.lastSeen}
              </p>
            </div>
            <div className="p-3 sm:p-4">
              <OpsMap
                motorcycles={[moto]}
                selectedId={moto.id}
                className="h-[260px] sm:h-[360px]"
                compact
              />
            </div>
          </Card>

          <Card>
            <h2 className="text-sm font-semibold text-text mb-4">
              Unit details
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <Info label="Plate" value={moto.plate} />
              <Info label="Fleet number" value={moto.fleetNumber} />
              <Info label="Brand / model" value={`${moto.brand} ${moto.model}`} />
              <Info label="Year" value={String(moto.year)} />
              <Info label="Color" value={moto.color} />
              <Info label="Last seen" value={moto.lastSeen} />
            </dl>
          </Card>

          <Card>
            <h2 className="text-sm font-semibold text-text mb-4">
              Recent trips
            </h2>
            {relatedTrips.length === 0 ? (
              <p className="text-sm text-text-muted">
                No recent trips for this motorcycle.
              </p>
            ) : (
              <ul className="divide-y divide-border -mx-1">
                {relatedTrips.map((t) => (
                  <li key={t.id}>
                    <Link
                      href={`/admin/trips/${t.id}`}
                      className="flex items-center justify-between gap-3 px-1 py-3 hover:bg-surface-muted/50 rounded-[8px] transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-primary">
                          {t.id}
                        </p>
                        <p className="text-xs text-text-secondary mt-0.5 truncate">
                          {t.pickup} → {t.destination}
                        </p>
                      </div>
                      <StatusBadge status={t.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Card>
            <h2 className="text-sm font-semibold text-text mb-4">
              Current assignment
            </h2>
            {rider ? (
              <div className="flex items-center gap-3">
                <Avatar initials={initials(rider.name)} size="lg" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text">{rider.name}</p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {rider.phone}
                  </p>
                  <div className="mt-2">
                    <StatusBadge status={rider.availability} />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-text-muted">No rider assigned.</p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" leftIcon={<UserPlus className="size-3.5" />}>
                Assign rider
              </Button>
              {rider ? (
                <Button
                  size="sm"
                  variant="danger-outline"
                  leftIcon={<UserMinus className="size-3.5" />}
                >
                  Unassign
                </Button>
              ) : null}
            </div>
          </Card>

          <Card>
            <h2 className="text-sm font-semibold text-text mb-4">
              Assignment history
            </h2>
            <ul className="space-y-3">
              {assignmentHistory.map((h) => (
                <li
                  key={`${h.rider}-${h.from}`}
                  className="rounded-[8px] border border-border px-3 py-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-text">{h.rider}</p>
                    <span className="text-[11px] text-text-muted whitespace-nowrap">
                      {h.from} – {h.to}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">{h.note}</p>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h2 className="text-sm font-semibold text-text mb-4">Status log</h2>
            <Timeline
              steps={[
                {
                  label: "Registered in fleet",
                  time: "12 Jan 2023",
                  done: true,
                },
                {
                  label: "GPS device paired",
                  time: "14 Jan 2023",
                  done: true,
                },
                {
                  label: "Assigned to current rider",
                  time: "1 Sep 2026",
                  done: true,
                  current: moto.status !== "maintenance",
                },
                {
                  label: "Next service due",
                  time: "Oct 2026 · 5,000 km",
                  done: false,
                  current: moto.status === "maintenance",
                },
              ]}
            />
          </Card>

          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" leftIcon={<Wrench className="size-3.5" />}>
              Mark maintenance
            </Button>
            <Button size="sm" variant="secondary">
              Edit details
            </Button>
            <Link href="/admin/live">
              <Button size="sm">View on live map</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] border border-border px-3 py-2">
      <dt className="text-[11px] uppercase tracking-wide text-text-muted">
        {label}
      </dt>
      <dd className="mt-0.5 font-medium text-text">{value}</dd>
    </div>
  );
}
