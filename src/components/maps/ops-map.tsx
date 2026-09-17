"use client";

import { cn } from "@/lib/utils";
import type { Motorcycle } from "@/types";
import { StatusBadge, StatusDot } from "@/components/ui/status-badge";
import { MapPin, Navigation, Zap } from "lucide-react";

const statusToMarker: Record<string, string> = {
  available: "bg-success border-green-700",
  assigned: "bg-primary border-blue-700",
  on_trip: "bg-primary border-blue-700",
  offline: "bg-slate-400 border-slate-600",
  unauthorized: "bg-danger border-red-800",
  maintenance: "bg-slate-500 border-slate-700",
};

/** Converts lat/lng around Kigali into percentage positions for the mock map */
function toPos(lat: number, lng: number) {
  const minLat = -2.02;
  const maxLat = -1.9;
  const minLng = 30.02;
  const maxLng = 30.16;
  const top = ((maxLat - lat) / (maxLat - minLat)) * 100;
  const left = ((lng - minLng) / (maxLng - minLng)) * 100;
  return {
    top: `${Math.min(Math.max(top, 8), 92)}%`,
    left: `${Math.min(Math.max(left, 8), 92)}%`,
  };
}

interface OpsMapProps {
  motorcycles: Motorcycle[];
  selectedId?: string | null;
  onSelect?: (m: Motorcycle) => void;
  className?: string;
  compact?: boolean;
  connecting?: boolean;
}

export function OpsMap({
  motorcycles,
  selectedId,
  onSelect,
  className,
  compact,
  connecting,
}: OpsMapProps) {
  const selected = motorcycles.find((m) => m.id === selectedId);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[12px] border border-border ops-map-bg",
        compact ? "min-h-[220px] h-full" : "min-h-[320px] sm:min-h-[420px] h-full",
        className,
      )}
    >
      {/* Soft area labels */}
      <span className="absolute top-[18%] left-[22%] text-[10px] font-medium text-slate-400/80">
        Gisozi
      </span>
      <span className="absolute top-[28%] left-[48%] text-[10px] font-medium text-slate-400/80">
        Kacyiru
      </span>
      <span className="absolute top-[38%] left-[72%] text-[10px] font-medium text-slate-400/80">
        Remera
      </span>
      <span className="absolute top-[55%] left-[78%] text-[10px] font-medium text-slate-400/80">
        Kimironko
      </span>
      <span className="absolute top-[68%] left-[55%] text-[10px] font-medium text-slate-400/80">
        Kicukiro
      </span>
      <span className="absolute top-[72%] left-[28%] text-[10px] font-medium text-slate-400/80">
        Nyamirambo
      </span>

      {/* Route hint line */}
      <svg className="absolute inset-0 size-full pointer-events-none opacity-40">
        <path
          d="M 35% 45% Q 50% 35% 70% 40%"
          fill="none"
          stroke="#2563EB"
          strokeWidth="2"
          strokeDasharray="6 6"
        />
      </svg>

      {motorcycles.map((m) => {
        const pos = toPos(m.lat, m.lng);
        const active = m.id === selectedId;
        return (
          <button
            key={m.id}
            type="button"
            style={{ top: pos.top, left: pos.left }}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2 size-3.5 rounded-full border-2 shadow-sm transition-transform",
              statusToMarker[m.status] ?? statusToMarker.offline,
              active && "scale-150 ring-4 ring-primary/25 z-10",
            )}
            onClick={() => onSelect?.(m)}
            title={`${m.plate} · ${m.status}`}
          />
        );
      })}

      {/* Map controls */}
      <div className="absolute top-3 right-3 flex flex-col gap-1">
        <button
          type="button"
          className="size-8 rounded-[8px] bg-surface border border-border text-text-secondary text-lg leading-none hover:bg-surface-muted"
        >
          +
        </button>
        <button
          type="button"
          className="size-8 rounded-[8px] bg-surface border border-border text-text-secondary text-lg leading-none hover:bg-surface-muted"
        >
          −
        </button>
      </div>

      <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-[8px] bg-surface border border-border px-2.5 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-muted"
        >
          <Navigation className="size-3.5" />
          Center fleet
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-[8px] bg-surface border border-border px-2.5 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-muted"
        >
          <Zap className="size-3.5" />
          Active trips
        </button>
      </div>

      {connecting ? (
        <div className="absolute inset-x-0 top-3 flex justify-center">
          <span className="rounded-full bg-surface/95 border border-border px-3 py-1 text-xs text-text-secondary">
            Connecting to live fleet...
          </span>
        </div>
      ) : null}

      {selected ? (
        <div className="absolute bottom-3 right-3 left-3 sm:left-auto sm:w-72 rounded-[10px] border border-border bg-surface p-3 shadow-[var(--shadow-overlay)]">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-sm text-text">{selected.plate}</p>
              <p className="text-xs text-text-secondary mt-0.5">
                {selected.riderName ?? "Unassigned"}
              </p>
            </div>
            <StatusBadge
              status={
                selected.status === "unauthorized"
                  ? "unauthorized"
                  : selected.status
              }
            />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1 text-text-secondary">
              <MapPin className="size-3.5" />
              {selected.location}
            </div>
            <div className="text-text-secondary">
              {selected.speed > 0 ? `${selected.speed} km/h` : "Stopped"}
            </div>
            <div className="text-text-muted col-span-2">{selected.lastSeen}</div>
          </div>
          <button
            type="button"
            className="mt-3 w-full rounded-[8px] border border-border py-1.5 text-xs font-medium text-primary hover:bg-primary-soft"
            onClick={() => onSelect?.(selected)}
          >
            View details
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function FleetLegend({ className }: { className?: string }) {
  const items = [
    { status: "available", label: "Available" },
    { status: "on_trip", label: "On trip" },
    { status: "pending", label: "Waiting" },
    { status: "offline", label: "Offline" },
    { status: "unauthorized", label: "Incident" },
  ] as const;

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {items.map((item) => (
        <span
          key={item.status}
          className="inline-flex items-center gap-1.5 text-xs text-text-secondary"
        >
          <StatusDot status={item.status} />
          {item.label}
        </span>
      ))}
    </div>
  );
}
