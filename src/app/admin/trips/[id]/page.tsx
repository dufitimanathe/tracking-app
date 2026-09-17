"use client";

import { OpsMap } from "@/components/maps/ops-map";
import { Button } from "@/components/ui/button";
import { Card, MetricCard } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Avatar, Timeline } from "@/components/ui/overlay";
import { StatusBadge } from "@/components/ui/status-badge";
import { motorcycles, trips } from "@/data/mock";
import { calculateFare, formatKm, formatRwf, initials } from "@/lib/utils";
import { ArrowLeft, Clock, Gauge, MapPin } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";

export default function TripDetailPage() {
  const params = useParams<{ id: string }>();
  const trip = trips.find((t) => t.id === params.id);

  const bike = useMemo(() => {
    if (!trip) return null;
    return (
      motorcycles.find((m) => m.plate === trip.motorcyclePlate) ??
      motorcycles[0]
    );
  }, [trip]);

  if (!trip) {
    return (
      <div className="max-w-[1400px] mx-auto py-16 text-center space-y-3">
        <h1 className="text-xl font-semibold text-text">Trip not found</h1>
        <p className="text-sm text-text-secondary">
          No trip matches <span className="font-medium">{params.id}</span>.
        </p>
        <Link
          href="/admin/trips"
          className="inline-flex h-10 items-center rounded-[8px] border border-border bg-surface px-4 text-sm font-medium text-text hover:bg-surface-muted"
        >
          Back to trips
        </Link>
      </div>
    );
  }

  const fare = calculateFare(trip.distanceKm);
  const isLive =
    trip.status === "in_progress" ||
    trip.status === "to_pickup" ||
    trip.status === "waiting" ||
    trip.status === "assigned";
  const isCompleted = trip.status === "completed";

  const timeline = [
    {
      label: "Request received",
      time: trip.requestedAt,
      done: !!trip.requestedAt || !!trip.assignedAt || isCompleted,
    },
    {
      label: "Rider assigned",
      time: trip.assignedAt,
      done: !!trip.assignedAt || !!trip.pickupAt || isCompleted || trip.status === "in_progress",
      current: trip.status === "assigned",
    },
    {
      label: "En route to pickup",
      time: trip.status === "to_pickup" ? "In progress" : trip.pickupAt ? undefined : undefined,
      done:
        trip.status === "waiting" ||
        trip.status === "in_progress" ||
        isCompleted ||
        !!trip.pickupAt,
      current: trip.status === "to_pickup",
    },
    {
      label: "Passenger picked up",
      time: trip.pickupAt ?? trip.startedAt,
      done: trip.status === "in_progress" || isCompleted,
      current: trip.status === "waiting",
    },
    {
      label: "Trip in progress",
      time: trip.startedAt,
      done: isCompleted,
      current: trip.status === "in_progress",
    },
    {
      label: "Completed",
      time: trip.completedAt,
      done: isCompleted,
      current: false,
    },
  ];

  if (trip.status === "cancelled") {
    timeline.push({
      label: "Cancelled",
      time: undefined,
      done: true,
      current: true,
    });
  }

  return (
    <div className="space-y-4 sm:space-y-5 max-w-[1400px] mx-auto">
      <PageHeader
        title={trip.id}
        description={`${trip.pickup} → ${trip.destination}`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={trip.status} />
            <Link
              href="/admin/trips"
              className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-border bg-surface px-3 text-xs font-medium text-text hover:bg-surface-muted"
            >
              <ArrowLeft className="size-3.5" />
              All trips
            </Link>
          </div>
        }
      />

      {(isLive || trip.etaMin != null) && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {trip.etaMin != null ? (
            <MetricCard
              label="ETA"
              value={`${trip.etaMin} min`}
              accent="primary"
              icon={<Clock className="size-4" />}
            />
          ) : null}
          {trip.currentSpeed != null ? (
            <MetricCard
              label="Speed"
              value={`${trip.currentSpeed} km/h`}
              icon={<Gauge className="size-4" />}
            />
          ) : null}
          <MetricCard
            label="Distance"
            value={formatKm(trip.distanceKm)}
            icon={<MapPin className="size-4" />}
          />
          <MetricCard label="Fare" value={formatRwf(trip.cost)} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-3 p-0 overflow-hidden" padding="none">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-sm font-semibold text-text">Trip map</h2>
            <p className="text-xs text-text-muted mt-0.5">
              {bike?.plate ?? trip.motorcyclePlate} · {trip.riderName}
            </p>
          </div>
          <div className="p-3 sm:p-4">
            <OpsMap
              motorcycles={bike ? [bike] : []}
              selectedId={bike?.id}
              className="h-[280px] sm:h-[420px]"
              compact
            />
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          <Card>
            <h2 className="text-sm font-semibold text-text mb-4">
              Trip details
            </h2>
            <div className="flex items-center gap-3 mb-4">
              <Avatar initials={initials(trip.employeeName)} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-text">
                  {trip.employeeName}
                </p>
                <p className="text-xs text-text-secondary">
                  {trip.employeePhone ?? "No phone on file"}
                </p>
              </div>
            </div>
            <dl className="space-y-3 text-sm">
              <DetailRow label="Rider" value={trip.riderName} />
              <DetailRow label="Motorcycle" value={trip.motorcyclePlate} />
              <DetailRow label="Pickup" value={trip.pickup} />
              <DetailRow label="Destination" value={trip.destination} />
              {trip.durationMin != null ? (
                <DetailRow
                  label="Duration"
                  value={`${trip.durationMin} min`}
                />
              ) : null}
              {trip.requestId ? (
                <DetailRow label="Request" value={trip.requestId} />
              ) : null}
            </dl>
          </Card>

          <Card>
            <h2 className="text-sm font-semibold text-text mb-4">Timeline</h2>
            <Timeline steps={timeline} />
          </Card>

          {isCompleted ? (
            <Card>
              <h2 className="text-sm font-semibold text-text mb-3">
                Fare breakdown
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-text-secondary">
                  <span>First km</span>
                  <span>{formatRwf(fare.firstKm > 0 ? 500 : 0)}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>
                    Remaining ({formatKm(fare.remainingKm)} × 400)
                  </span>
                  <span>{formatRwf(fare.remainingCost)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 font-semibold text-text">
                  <span>Total</span>
                  <span>{formatRwf(fare.total || trip.cost)}</span>
                </div>
              </div>
            </Card>
          ) : null}

          {isLive ? (
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm">
                Contact rider
              </Button>
              <Button variant="danger-outline" size="sm">
                Cancel trip
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-text-muted">{label}</dt>
      <dd className="font-medium text-text text-right">{value}</dd>
    </div>
  );
}
