"use client";

import { Button } from "@/components/ui/button";
import { Card, MetricCard } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Avatar } from "@/components/ui/overlay";
import { motorcycles, riders, trips } from "@/data/mock";
import { initials } from "@/lib/utils";
import {
  ArrowLeft,
  Bike,
  Mail,
  MapPin,
  Phone,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";

const assignmentHistory = [
  {
    id: "asg_current",
    plate: "RAE 428C",
    fleetNumber: "VT-014",
    assignedAt: "1 Sep 2026",
    releasedAt: null as string | null,
    current: true,
  },
  {
    id: "asg_prev_1",
    plate: "RAD 103B",
    fleetNumber: "VT-008",
    assignedAt: "12 Jun 2026",
    releasedAt: "31 Aug 2026",
    current: false,
  },
  {
    id: "asg_prev_2",
    plate: "RAG 551D",
    fleetNumber: "VT-003",
    assignedAt: "3 Mar 2026",
    releasedAt: "10 Jun 2026",
    current: false,
  },
];

export default function RiderDetailPage() {
  const params = useParams<{ id: string }>();
  const rider = riders.find((r) => r.id === params.id) ?? riders[0];

  const motorcycle = useMemo(
    () => motorcycles.find((m) => m.id === rider.motorcycleId),
    [rider.motorcycleId],
  );

  const riderTrips = useMemo(
    () => trips.filter((t) => t.riderName === rider.name),
    [rider.name],
  );

  const completed = riderTrips.filter((t) => t.status === "completed").length;
  const cancelled = riderTrips.filter((t) => t.status === "cancelled").length;

  const history = assignmentHistory.map((item, index) =>
    index === 0
      ? {
          ...item,
          plate: rider.motorcyclePlate ?? item.plate,
          fleetNumber: motorcycle?.fleetNumber ?? item.fleetNumber,
        }
      : item,
  );

  return (
    <div className="space-y-5 sm:space-y-6 max-w-[1100px] mx-auto">
      <div>
        <Link
          href="/admin/riders"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text mb-3"
        >
          <ArrowLeft className="size-4" />
          Back to riders
        </Link>
        <PageHeader
          title={rider.name}
          description="Rider profile, motorcycle assignment, and trip activity."
          actions={
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" leftIcon={<Bike className="size-3.5" />}>
                Assign motorcycle
              </Button>
              <Button variant="danger-outline" size="sm">
                Suspend
              </Button>
              <Button size="sm" leftIcon={<Phone className="size-3.5" />}>
                Contact
              </Button>
            </div>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
          <div className="flex items-start gap-3">
            <Avatar initials={initials(rider.name)} size="lg" />
            <div className="min-w-0">
              <p className="text-lg font-semibold text-text">{rider.name}</p>
              <div className="mt-2">
                <StatusBadge status={rider.availability} />
              </div>
            </div>
          </div>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex items-center gap-2 text-text-secondary">
              <Phone className="size-4 shrink-0 text-text-muted" />
              <span>{rider.phone}</span>
            </div>
            {rider.email ? (
              <div className="flex items-center gap-2 text-text-secondary">
                <Mail className="size-4 shrink-0 text-text-muted" />
                <span className="truncate">{rider.email}</span>
              </div>
            ) : null}
            <div className="flex items-center gap-2 text-text-secondary">
              <MapPin className="size-4 shrink-0 text-text-muted" />
              <span>{rider.location}</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <Star className="size-4 shrink-0 text-text-muted" />
              <span>{rider.rating.toFixed(1)} rating · Last active {rider.lastActive}</span>
            </div>
          </dl>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="text-base font-semibold text-text">Motorcycle assignment</h2>
          <p className="text-xs text-text-muted mt-0.5">Current unit linked to this rider</p>
          {motorcycle ? (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wide">Plate</p>
                <p className="mt-1 font-medium text-text">{motorcycle.plate}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wide">Fleet #</p>
                <p className="mt-1 font-medium text-text">{motorcycle.fleetNumber}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wide">Unit</p>
                <p className="mt-1 font-medium text-text">
                  {motorcycle.brand} {motorcycle.model}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wide">GPS</p>
                <div className="mt-1">
                  <StatusBadge status={motorcycle.gpsStatus} />
                </div>
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wide">Fleet status</p>
                <div className="mt-1">
                  <StatusBadge status={motorcycle.status} />
                </div>
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wide">Today</p>
                <p className="mt-1 font-medium text-text">
                  {motorcycle.tripsToday} trips · {motorcycle.distanceTodayKm} km
                </p>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-text-secondary">No motorcycle currently assigned.</p>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard label="Trips today" value={rider.tripsToday} accent="primary" />
        <MetricCard label="Completed (sample)" value={completed} accent="success" />
        <MetricCard label="Cancelled (sample)" value={cancelled} />
        <MetricCard label="Rating" value={rider.rating.toFixed(1)} hint="Out of 5.0" />
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-base font-semibold text-text">Assignment history</h2>
          <p className="text-xs text-text-muted mt-0.5">
            Current assignment and previous motorcycles
          </p>
        </div>

        <ul className="md:hidden divide-y divide-border">
          {history.map((item) => (
            <li key={item.id} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-text">{item.plate}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{item.fleetNumber}</p>
                </div>
                {item.current ? (
                  <StatusBadge status="assigned" label="Current" />
                ) : (
                  <StatusBadge status="completed" label="Previous" />
                )}
              </div>
              <p className="mt-2 text-xs text-text-muted">
                {item.assignedAt}
                {item.releasedAt ? ` → ${item.releasedAt}` : " → Present"}
              </p>
            </li>
          ))}
        </ul>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted/50 text-left text-xs uppercase tracking-wide text-text-muted">
                <th className="px-4 py-3 font-medium">Plate</th>
                <th className="px-4 py-3 font-medium">Fleet #</th>
                <th className="px-4 py-3 font-medium">Assigned</th>
                <th className="px-4 py-3 font-medium">Released</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {history.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 font-medium text-text">{item.plate}</td>
                  <td className="px-4 py-3 text-text-secondary">{item.fleetNumber}</td>
                  <td className="px-4 py-3 text-text-secondary">{item.assignedAt}</td>
                  <td className="px-4 py-3 text-text-secondary">
                    {item.releasedAt ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    {item.current ? (
                      <StatusBadge status="assigned" label="Current" />
                    ) : (
                      <StatusBadge status="completed" label="Previous" />
                    )}
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
