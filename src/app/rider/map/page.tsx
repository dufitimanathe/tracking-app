"use client";

import { FleetLegend, OpsMap } from "@/components/maps/ops-map";
import { Card } from "@/components/ui/card";
import { LiveIndicator, PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { motorcycles } from "@/data/mock";
import { formatKm } from "@/lib/utils";
import { useState } from "react";

export default function RiderMapPage() {
  const myMoto = motorcycles.find((m) => m.plate === "RAE 428C") ?? motorcycles[0];
  const [selectedId, setSelectedId] = useState(myMoto.id);
  // Focus rider: show own bike prominently plus nearby fleet for context
  const nearby = motorcycles.filter(
    (m) => m.id === myMoto.id || m.status === "available" || m.status === "on_trip",
  );

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <PageHeader
        title="Live map"
        description="Your position and nearby fleet."
        actions={<LiveIndicator />}
      />

      <Card padding="md">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-text">{myMoto.plate}</p>
            <p className="text-xs text-text-secondary mt-0.5">{myMoto.location}</p>
          </div>
          <StatusBadge status={myMoto.status} />
        </div>
        <p className="mt-2 text-xs text-text-muted">
          {myMoto.speed > 0 ? `${myMoto.speed} km/h` : "Stopped"} ·{" "}
          {formatKm(myMoto.distanceTodayKm)} today · {myMoto.lastSeen}
        </p>
      </Card>

      <OpsMap
        motorcycles={nearby}
        selectedId={selectedId}
        onSelect={(m) => setSelectedId(m.id)}
        className="h-[360px] sm:h-[420px]"
        compact
      />

      <FleetLegend />
    </div>
  );
}
