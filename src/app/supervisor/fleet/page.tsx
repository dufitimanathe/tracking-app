"use client";

import { FleetLegend, OpsMap } from "@/components/maps/ops-map";
import { Card } from "@/components/ui/card";
import { LiveIndicator, PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { motorcycles } from "@/data/mock";
import { formatKm } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import { setSelectedMotorcycleId } from "@/store/slices/ui-slice";

export default function SupervisorFleetPage() {
  const dispatch = useAppDispatch();
  const selectedId = useAppSelector((s) => s.ui.selectedMotorcycleId);
  const selected = motorcycles.find((m) => m.id === selectedId) ?? motorcycles[0];

  return (
    <div className="max-w-[1400px] mx-auto space-y-4">
      <PageHeader
        title="Fleet view"
        description="Read-only live positions for situational awareness."
        actions={<LiveIndicator />}
      />

      <FleetLegend />

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <Card className="xl:col-span-3 p-0 overflow-hidden" padding="none">
          <div className="p-3 sm:p-4">
            <OpsMap
              motorcycles={motorcycles}
              selectedId={selected?.id}
              onSelect={(m) => dispatch(setSelectedMotorcycleId(m.id))}
              className="h-[320px] sm:h-[480px]"
            />
          </div>
        </Card>

        <Card className="xl:col-span-2 p-0 overflow-hidden" padding="none">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-base font-semibold text-text">Motorcycles</h2>
            <p className="text-xs text-text-muted mt-0.5">Tap a unit for details</p>
          </div>
          <ul className="divide-y divide-border max-h-[520px] overflow-y-auto panel-scroll">
            {motorcycles.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  className="w-full text-left px-4 py-3 hover:bg-surface-muted/60 transition-colors"
                  onClick={() => dispatch(setSelectedMotorcycleId(m.id))}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-text">{m.plate}</p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {m.fleetNumber} · {m.riderName ?? "Unassigned"}
                      </p>
                    </div>
                    <StatusBadge status={m.status} />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-text-muted">
                    <span>{m.location}</span>
                    <span>{formatKm(m.distanceTodayKm)} today</span>
                    <span>
                      GPS{" "}
                      {m.gpsStatus === "online"
                        ? "online"
                        : m.gpsStatus === "delayed"
                          ? "delayed"
                          : "offline"}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
