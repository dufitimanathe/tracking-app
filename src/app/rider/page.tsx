"use client";

import { Button } from "@/components/ui/button";
import { Card, MetricCard } from "@/components/ui/card";
import { Modal } from "@/components/ui/overlay";
import { StatusBadge } from "@/components/ui/status-badge";
import { motorcycles, trips } from "@/data/mock";
import { formatKm, greetingForHour } from "@/lib/utils";
import { useAppSelector } from "@/store";
import { Bike, MapPin, Navigation, Power, Route } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function RiderHomePage() {
  const { userName } = useAppSelector((s) => s.auth);
  const moto = motorcycles.find((m) => m.plate === "RAE 428C") ?? motorcycles[0];
  const activeTrip = trips.find((t) => t.id === "TRIP-2379");
  const [online, setOnline] = useState(true);
  const [assignmentOpen, setAssignmentOpen] = useState(true);

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div>
        <p className="text-sm text-text-secondary">
          {greetingForHour()}, {userName.split(" ")[0]}
        </p>
        <h1 className="text-xl font-semibold text-text tracking-tight mt-0.5">
          Rider home
        </h1>
      </div>

      <Card padding="md">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-[10px] bg-primary-soft p-2.5 text-primary">
              <Bike className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text">{moto.plate}</p>
              <p className="text-xs text-text-muted mt-0.5">
                {moto.fleetNumber} · {moto.brand} {moto.model}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <StatusBadge status={online ? "online" : "offline"} />
          <StatusBadge
            status={online ? "available" : "offline"}
            label={online ? "Available" : "Offline"}
          />
          <StatusBadge
            status={moto.gpsStatus === "online" ? "online" : "gps_offline"}
            label={moto.gpsStatus === "online" ? "GPS Connected" : "GPS Offline"}
          />
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Button
          size="lg"
          fullWidth
          disabled={online}
          leftIcon={<Power className="size-4" />}
          onClick={() => setOnline(true)}
        >
          Go Online
        </Button>
        <Button
          size="lg"
          fullWidth
          variant="secondary"
          disabled={!online}
          leftIcon={<Power className="size-4" />}
          onClick={() => setOnline(false)}
        >
          Go Offline
        </Button>
      </div>

      {activeTrip ? (
        <Card padding="md" className="border-l-[3px] border-l-primary">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Current trip
              </p>
              <p className="text-sm font-semibold text-text mt-1">{activeTrip.id}</p>
            </div>
            <StatusBadge status={activeTrip.status} />
          </div>
          <p className="mt-2 text-sm text-text-secondary">
            {activeTrip.employeeName}
          </p>
          <p className="mt-1 text-sm text-text">
            {activeTrip.pickup} → {activeTrip.destination}
          </p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-text-muted">
            {activeTrip.etaMin != null ? <span>ETA {activeTrip.etaMin} min</span> : null}
            <span>{formatKm(activeTrip.distanceKm)}</span>
            {activeTrip.currentSpeed != null ? (
              <span>{activeTrip.currentSpeed} km/h</span>
            ) : null}
          </div>
          <Link href="/rider/active" className="mt-4 block">
            <Button fullWidth leftIcon={<Navigation className="size-4" />}>
              Open active trip
            </Button>
          </Link>
        </Card>
      ) : null}

      <div className="grid grid-cols-3 gap-3">
        <MetricCard label="Trips Today" value={moto.tripsToday} className="!p-3" />
        <MetricCard
          label="Completed"
          value={3}
          accent="success"
          className="!p-3"
        />
        <MetricCard
          label="Distance"
          value={formatKm(moto.distanceTodayKm)}
          icon={<Route className="size-3.5" />}
          className="!p-3"
        />
      </div>

      <Card padding="md">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <MapPin className="size-4 text-text-muted" />
          Current area: {moto.location}
        </div>
        <Link
          href="/rider/map"
          className="mt-3 inline-block text-xs font-medium text-primary"
        >
          Open map
        </Link>
      </Card>

      <Modal
        open={assignmentOpen && online}
        onClose={() => setAssignmentOpen(false)}
        title="New trip assignment"
        description="REQ-2841 · Alice Uwimana"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAssignmentOpen(false)}>
              Decline
            </Button>
            <Button
              onClick={() => {
                setAssignmentOpen(false);
              }}
            >
              Accept
            </Button>
          </>
        }
      >
        <div className="space-y-2 text-sm">
          <p className="text-text">
            <span className="text-text-muted">Pickup:</span> Kicukiro
          </p>
          <p className="text-text">
            <span className="text-text-muted">Destination:</span> Remera
          </p>
          <p className="text-text-secondary text-xs pt-1">
            Est. 6.3 km · ~2,620 RWF · Requested for 8:00 AM
          </p>
        </div>
      </Modal>
    </div>
  );
}
