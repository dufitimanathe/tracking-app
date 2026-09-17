"use client";

import { OpsMap } from "@/components/maps/ops-map";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Timeline } from "@/components/ui/overlay";
import { StatusBadge } from "@/components/ui/status-badge";
import { motorcycles, trips } from "@/data/mock";
import { formatKm, formatRwf } from "@/lib/utils";
import {
  CheckCircle2,
  Flag,
  MapPinned,
  Navigation,
  Play,
} from "lucide-react";
import { useMemo, useState } from "react";

type TripPhase = "navigate" | "arrived" | "start" | "complete" | "done";

const PHASE_ORDER: TripPhase[] = [
  "navigate",
  "arrived",
  "start",
  "complete",
  "done",
];

export default function RiderActiveTripPage() {
  const trip = trips.find((t) => t.id === "TRIP-2379") ?? trips[0];
  const moto = motorcycles.find((m) => m.plate === trip.motorcyclePlate) ?? motorcycles[0];
  const [phase, setPhase] = useState<TripPhase>("navigate");

  const action = useMemo(() => {
    switch (phase) {
      case "navigate":
        return {
          label: "Navigate to Pickup",
          icon: <Navigation className="size-4" />,
          next: "arrived" as TripPhase,
        };
      case "arrived":
        return {
          label: "Arrived",
          icon: <MapPinned className="size-4" />,
          next: "start" as TripPhase,
        };
      case "start":
        return {
          label: "Start Trip",
          icon: <Play className="size-4" />,
          next: "complete" as TripPhase,
        };
      case "complete":
        return {
          label: "Complete Trip",
          icon: <Flag className="size-4" />,
          next: "done" as TripPhase,
        };
      default:
        return null;
    }
  }, [phase]);

  const statusLabel =
    phase === "navigate"
      ? "to_pickup"
      : phase === "arrived"
        ? "waiting"
        : phase === "start" || phase === "complete"
          ? "in_progress"
          : "completed";

  const timeline = [
    {
      label: "Assigned",
      time: trip.assignedAt ?? "Today, 7:35 AM",
      done: true,
    },
    {
      label: "En route to pickup",
      time: phase !== "navigate" ? "Today, 7:40 AM" : undefined,
      done: phase !== "navigate",
      current: phase === "navigate",
    },
    {
      label: "Arrived at pickup",
      time: PHASE_ORDER.indexOf(phase) >= 2 ? "Today, 7:48 AM" : undefined,
      done: PHASE_ORDER.indexOf(phase) >= 2,
      current: phase === "arrived",
    },
    {
      label: "Trip in progress",
      time:
        PHASE_ORDER.indexOf(phase) >= 3
          ? trip.startedAt ?? "Today, 7:51 AM"
          : undefined,
      done: PHASE_ORDER.indexOf(phase) >= 3,
      current: phase === "start" || phase === "complete",
    },
    {
      label: "Completed",
      time: phase === "done" ? "Just now" : undefined,
      done: phase === "done",
      current: phase === "done",
    },
  ];

  return (
    <div className="mx-auto max-w-lg space-y-4 pb-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Active trip
          </p>
          <h1 className="text-xl font-semibold text-text tracking-tight mt-0.5">
            {trip.id}
          </h1>
        </div>
        <StatusBadge status={statusLabel} />
      </div>

      <OpsMap
        motorcycles={[moto]}
        selectedId={moto.id}
        className="h-[220px]"
        compact
      />

      <Card padding="md">
        <p className="text-xs text-text-muted uppercase tracking-wide font-semibold">
          Employee
        </p>
        <p className="text-sm font-semibold text-text mt-1">{trip.employeeName}</p>
        {trip.employeePhone ? (
          <p className="text-xs text-text-secondary mt-0.5">{trip.employeePhone}</p>
        ) : null}

        <div className="mt-4 grid grid-cols-1 gap-3">
          <div className="rounded-[10px] bg-surface-muted px-3 py-2.5">
            <p className="text-[11px] text-text-muted font-medium">Pickup</p>
            <p className="text-sm font-medium text-text mt-0.5">{trip.pickup}</p>
          </div>
          <div className="rounded-[10px] bg-surface-muted px-3 py-2.5">
            <p className="text-[11px] text-text-muted font-medium">Destination</p>
            <p className="text-sm font-medium text-text mt-0.5">{trip.destination}</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
          <span>{formatKm(trip.distanceKm)}</span>
          <span>{formatRwf(trip.cost)}</span>
          {trip.etaMin != null && phase !== "done" ? (
            <span>ETA {trip.etaMin} min</span>
          ) : null}
        </div>
      </Card>

      <Card padding="md">
        <h2 className="text-sm font-semibold text-text mb-3">Timeline</h2>
        <Timeline steps={timeline} />
      </Card>

      {action ? (
        <Button
          size="lg"
          fullWidth
          leftIcon={action.icon}
          onClick={() => setPhase(action.next)}
        >
          {action.label}
        </Button>
      ) : (
        <Card padding="md" className="text-center bg-success-soft border-green-200">
          <CheckCircle2 className="size-8 text-success mx-auto" />
          <p className="mt-2 text-sm font-semibold text-text">Trip completed</p>
          <p className="text-xs text-text-secondary mt-1">
            Great work — head back online when you&apos;re ready.
          </p>
        </Card>
      )}
    </div>
  );
}
