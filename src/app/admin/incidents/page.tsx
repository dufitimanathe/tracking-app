"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/input";
import { PageHeader, Tabs } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Drawer } from "@/components/ui/overlay";
import { OpsMap } from "@/components/maps/ops-map";
import { incidents as initialIncidents, motorcycles } from "@/data/mock";
import { cn, formatKm } from "@/lib/utils";
import type { Incident } from "@/types";
import { AlertTriangle, CheckCircle2, Phone } from "lucide-react";
import { useMemo, useState } from "react";

function incidentStatusTone(status: Incident["status"]) {
  if (status === "open") return "warning" as const;
  if (status === "acknowledged") return "pending" as const;
  return "completed" as const;
}

function incidentStatusLabel(status: Incident["status"]) {
  if (status === "open") return "Open";
  if (status === "acknowledged") return "Acknowledged";
  return "Resolved";
}

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusTab, setStatusTab] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = incidents.find((i) => i.id === selectedId) ?? null;

  const filtered = useMemo(() => {
    return incidents.filter((inc) => {
      const severityOk =
        severityFilter === "all" || inc.severity === severityFilter;
      const statusOk = statusTab === "all" || inc.status === statusTab;
      return severityOk && statusOk;
    });
  }, [incidents, severityFilter, statusTab]);

  const counts = useMemo(
    () => ({
      all: incidents.length,
      open: incidents.filter((i) => i.status === "open").length,
      acknowledged: incidents.filter((i) => i.status === "acknowledged").length,
      resolved: incidents.filter((i) => i.status === "resolved").length,
    }),
    [incidents],
  );

  function updateStatus(id: string, status: Incident["status"]) {
    setIncidents((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status } : i)),
    );
  }

  const trailMotorcycles = selected
    ? motorcycles.filter((m) => m.plate === selected.motorcyclePlate)
    : [];

  return (
    <div className="space-y-5 sm:space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        title="Incidents"
        description="Monitor unauthorized movement, GPS issues, and operational alerts."
      />

      <Card padding="none" className="overflow-hidden">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 py-3 border-b border-border">
          <Tabs
            tabs={[
              { id: "all", label: "All", count: counts.all },
              { id: "open", label: "Open", count: counts.open },
              { id: "acknowledged", label: "Acknowledged", count: counts.acknowledged },
              { id: "resolved", label: "Resolved", count: counts.resolved },
            ]}
            active={statusTab}
            onChange={setStatusTab}
            className="border-b-0"
          />
          <Select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-full sm:w-44"
          >
            <option value="all">All severities</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </Select>
        </div>

        <ul className="md:hidden divide-y divide-border">
          {filtered.map((inc) => (
            <li key={inc.id}>
              <button
                type="button"
                className="w-full text-left p-4 hover:bg-surface-muted/50 transition-colors"
                onClick={() => setSelectedId(inc.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-text">{inc.type}</p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {inc.id} · {inc.motorcyclePlate}
                    </p>
                  </div>
                  <StatusBadge status={inc.severity} />
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-text-secondary">
                  <span>{inc.riderName}</span>
                  <span>·</span>
                  <span>{inc.location}</span>
                  <span>·</span>
                  <span>{inc.detectedAt}</span>
                </div>
                <div className="mt-2">
                  <StatusBadge
                    status={incidentStatusTone(inc.status)}
                    label={incidentStatusLabel(inc.status)}
                  />
                </div>
              </button>
            </li>
          ))}
          {filtered.length === 0 ? (
            <li className="px-4 py-10 text-center text-sm text-text-muted">
              No incidents match these filters.
            </li>
          ) : null}
        </ul>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted/50 text-left text-xs uppercase tracking-wide text-text-muted">
                <th className="px-4 py-3 font-medium">Incident</th>
                <th className="px-4 py-3 font-medium">Severity</th>
                <th className="px-4 py-3 font-medium">Motorcycle</th>
                <th className="px-4 py-3 font-medium">Rider</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Detected</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((inc) => (
                <tr
                  key={inc.id}
                  className={cn(
                    "cursor-pointer hover:bg-surface-muted/40 transition-colors",
                    selectedId === inc.id && "bg-primary-soft/40",
                  )}
                  onClick={() => setSelectedId(inc.id)}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-text">{inc.type}</p>
                    <p className="text-xs text-text-muted">{inc.id}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={inc.severity} />
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{inc.motorcyclePlate}</td>
                  <td className="px-4 py-3 text-text-secondary">{inc.riderName}</td>
                  <td className="px-4 py-3 text-text-secondary">{inc.location}</td>
                  <td className="px-4 py-3 text-text-muted">{inc.detectedAt}</td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={incidentStatusTone(inc.status)}
                      label={incidentStatusLabel(inc.status)}
                    />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-text-muted">
                    No incidents match these filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>

      <Drawer
        open={!!selected}
        onClose={() => setSelectedId(null)}
        title={selected?.type ?? "Incident"}
        subtitle={selected ? `${selected.id} · ${selected.motorcyclePlate}` : undefined}
        width="lg"
        footer={
          selected ? (
            <>
              {selected.status === "open" ? (
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<AlertTriangle className="size-3.5" />}
                  onClick={() => updateStatus(selected.id, "acknowledged")}
                >
                  Acknowledge
                </Button>
              ) : null}
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Phone className="size-3.5" />}
              >
                Contact
              </Button>
              {selected.status !== "resolved" ? (
                <Button
                  size="sm"
                  leftIcon={<CheckCircle2 className="size-3.5" />}
                  onClick={() => {
                    updateStatus(selected.id, "resolved");
                    setSelectedId(null);
                  }}
                >
                  Resolve
                </Button>
              ) : null}
            </>
          ) : null
        }
      >
        {selected ? (
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={selected.severity} />
              <StatusBadge
                status={incidentStatusTone(selected.status)}
                label={incidentStatusLabel(selected.status)}
              />
            </div>

            <p className="text-sm text-text-secondary">{selected.description}</p>

            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-text-muted uppercase tracking-wide">Rider</dt>
                <dd className="mt-1 font-medium text-text">{selected.riderName}</dd>
              </div>
              <div>
                <dt className="text-xs text-text-muted uppercase tracking-wide">Location</dt>
                <dd className="mt-1 font-medium text-text">{selected.location}</dd>
              </div>
              <div>
                <dt className="text-xs text-text-muted uppercase tracking-wide">Detected</dt>
                <dd className="mt-1 font-medium text-text">{selected.detectedAt}</dd>
              </div>
              <div>
                <dt className="text-xs text-text-muted uppercase tracking-wide">Duration</dt>
                <dd className="mt-1 font-medium text-text">{selected.duration}</dd>
              </div>
              {typeof selected.distanceTravelledKm === "number" ? (
                <div>
                  <dt className="text-xs text-text-muted uppercase tracking-wide">Distance</dt>
                  <dd className="mt-1 font-medium text-text">
                    {formatKm(selected.distanceTravelledKm)}
                  </dd>
                </div>
              ) : null}
              {typeof selected.currentSpeed === "number" ? (
                <div>
                  <dt className="text-xs text-text-muted uppercase tracking-wide">Speed</dt>
                  <dd className="mt-1 font-medium text-text">{selected.currentSpeed} km/h</dd>
                </div>
              ) : null}
            </dl>

            <div>
              <h3 className="text-sm font-semibold text-text mb-2">Movement trail</h3>
              <p className="text-xs text-text-muted mb-3">
                Approximate path around last known position (placeholder)
              </p>
              {trailMotorcycles.length > 0 ? (
                <OpsMap
                  motorcycles={trailMotorcycles}
                  selectedId={trailMotorcycles[0]?.id}
                  compact
                  className="min-h-[220px] h-[220px]"
                />
              ) : (
                <div className="rounded-[12px] border border-dashed border-border bg-surface-muted/50 h-[180px] flex items-center justify-center text-sm text-text-muted">
                  No GPS trail available
                </div>
              )}
            </div>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}
