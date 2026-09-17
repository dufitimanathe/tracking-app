"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Avatar } from "@/components/ui/overlay";
import { StatusBadge } from "@/components/ui/status-badge";
import { company, motorcycles, riderUser } from "@/data/mock";
import { useAppDispatch } from "@/store";
import { logout } from "@/store/slices/auth-slice";
import { Bike, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RiderProfilePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const moto = motorcycles.find((m) => m.plate === "RAE 428C") ?? motorcycles[0];

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <PageHeader title="Profile" description="Account and motorcycle assignment." />

      <Card padding="lg">
        <div className="flex items-center gap-4">
          <Avatar initials={riderUser.avatarInitials} size="lg" />
          <div>
            <p className="text-lg font-semibold text-text">{riderUser.name}</p>
            <p className="text-sm text-text-secondary">{riderUser.email}</p>
            <div className="mt-2">
              <StatusBadge status="on_trip" label="Rider" />
            </div>
          </div>
        </div>

        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between gap-4 border-b border-border pb-3">
            <dt className="text-text-muted">Phone</dt>
            <dd className="font-medium text-text">{riderUser.phone}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-border pb-3">
            <dt className="text-text-muted">Company</dt>
            <dd className="font-medium text-text text-right">{company.name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-text-muted">Role</dt>
            <dd className="font-medium text-text">Rider</dd>
          </div>
        </dl>
      </Card>

      <Card padding="lg">
        <div className="flex items-center gap-2 mb-4">
          <Bike className="size-4 text-primary" />
          <h2 className="text-sm font-semibold text-text">Motorcycle assignment</h2>
        </div>
        <div className="rounded-[10px] border border-border bg-surface-muted/50 p-3">
          <p className="text-base font-semibold text-text">{moto.plate}</p>
          <p className="text-sm text-text-secondary mt-0.5">
            {moto.fleetNumber} · {moto.brand} {moto.model} ({moto.year})
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <StatusBadge status={moto.status} />
            <StatusBadge
              status={moto.gpsStatus === "online" ? "online" : "gps_offline"}
              label={
                moto.gpsStatus === "online"
                  ? "GPS Connected"
                  : moto.gpsStatus === "delayed"
                    ? "GPS Delayed"
                    : "GPS Offline"
              }
            />
          </div>
          <p className="text-xs text-text-muted mt-3">
            Color: {moto.color} · Last seen: {moto.lastSeen}
          </p>
        </div>
      </Card>

      <Button
        variant="danger-outline"
        fullWidth
        leftIcon={<LogOut className="size-4" />}
        onClick={() => {
          dispatch(logout());
          router.push("/login");
        }}
      >
        Sign out
      </Button>
    </div>
  );
}
