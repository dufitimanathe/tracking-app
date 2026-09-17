"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/input";
import {
  EmptyState,
  PageHeader,
  Tabs,
} from "@/components/ui/page-header";
import { Avatar, Drawer } from "@/components/ui/overlay";
import { StatusBadge } from "@/components/ui/status-badge";
import { requests } from "@/data/mock";
import { calculateFare, formatKm, formatRwf, initials } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import { setSelectedRequestId } from "@/store/slices/ui-slice";
import type { RequestStatus, TransportRequest } from "@/types";
import { ClipboardList, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

type RequestTab = "pending" | "approved" | "rejected" | "cancelled" | "all";

export default function RequestsPage() {
  const dispatch = useAppDispatch();
  const selectedId = useAppSelector((s) => s.ui.selectedRequestId);
  const [tab, setTab] = useState<RequestTab>("pending");
  const [query, setQuery] = useState("");
  const [localStatus, setLocalStatus] = useState<
    Record<string, RequestStatus>
  >({});

  const selected =
    requests.find((r) => r.id === selectedId) ?? null;
  const selectedStatus = selected
    ? (localStatus[selected.id] ?? selected.status)
    : null;

  const counts = useMemo(() => {
    const withLocal = requests.map((r) => ({
      ...r,
      status: localStatus[r.id] ?? r.status,
    }));
    return {
      pending: withLocal.filter((r) => r.status === "pending").length,
      approved: withLocal.filter((r) => r.status === "approved").length,
      rejected: withLocal.filter((r) => r.status === "rejected").length,
      cancelled: withLocal.filter((r) => r.status === "cancelled").length,
      all: withLocal.length,
    };
  }, [localStatus]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return requests
      .map((r) => ({ ...r, status: localStatus[r.id] ?? r.status }))
      .filter((r) => {
        if (tab !== "all" && r.status !== tab) return false;
        if (!q) return true;
        return (
          r.id.toLowerCase().includes(q) ||
          r.employeeName.toLowerCase().includes(q) ||
          r.pickup.toLowerCase().includes(q) ||
          r.destination.toLowerCase().includes(q) ||
          (r.department?.toLowerCase().includes(q) ?? false)
        );
      });
  }, [tab, query, localStatus]);

  function openRequest(r: TransportRequest) {
    dispatch(setSelectedRequestId(r.id));
  }

  function closeDrawer() {
    dispatch(setSelectedRequestId(null));
  }

  function setStatus(id: string, status: RequestStatus) {
    setLocalStatus((prev) => ({ ...prev, [id]: status }));
  }

  const fare = selected
    ? calculateFare(selected.estimatedDistanceKm)
    : null;

  return (
    <div className="space-y-4 sm:space-y-5 max-w-[1400px] mx-auto">
      <PageHeader
        title="Transport Requests"
        description="Review and approve employee transport requests"
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          tabs={[
            { id: "pending", label: "Pending", count: counts.pending },
            { id: "approved", label: "Approved", count: counts.approved },
            { id: "rejected", label: "Rejected", count: counts.rejected },
            { id: "cancelled", label: "Cancelled", count: counts.cancelled },
            { id: "all", label: "All", count: counts.all },
          ]}
          active={tab}
          onChange={(id) => setTab(id as RequestTab)}
        />
        <SearchInput
          placeholder="Search employee, route, ID…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full sm:w-72"
        />
      </div>

      <Card padding="none" className="overflow-hidden">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted/40 text-left text-xs uppercase tracking-wide text-text-muted">
                <th className="px-4 py-3 font-medium">Request</th>
                <th className="px-4 py-3 font-medium">Employee</th>
                <th className="px-4 py-3 font-medium">Route</th>
                <th className="px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 font-medium">Est. fare</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-surface-muted/50 cursor-pointer transition-colors"
                  onClick={() => openRequest(r)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-text">{r.id}</span>
                      {r.aiAssisted ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-1.5 py-0.5 text-[10px] font-medium text-primary">
                          <Sparkles className="size-2.5" />
                          AI
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xs text-text-muted mt-0.5 capitalize">
                      {r.channel}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-text">{r.employeeName}</p>
                    <p className="text-xs text-text-muted">
                      {r.department ?? "—"}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {r.pickup} → {r.destination}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    <p>{r.requestedTime}</p>
                    <p className="text-xs text-text-muted">{r.createdAt}</p>
                  </td>
                  <td className="px-4 py-3 font-medium text-text">
                    {formatRwf(r.estimatedCost)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <ul className="md:hidden divide-y divide-border">
          {filtered.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                className="w-full text-left px-4 py-3 hover:bg-surface-muted/50 transition-colors"
                onClick={() => openRequest(r)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-text">{r.id}</p>
                      {r.aiAssisted ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-1.5 py-0.5 text-[10px] font-medium text-primary">
                          <Sparkles className="size-2.5" />
                          AI
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm text-text mt-0.5">{r.employeeName}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                <p className="mt-2 text-xs text-text-secondary">
                  {r.pickup} → {r.destination}
                </p>
                <div className="mt-2 flex items-center justify-between text-xs text-text-muted">
                  <span>{r.requestedTime}</span>
                  <span className="font-medium text-text">
                    {formatRwf(r.estimatedCost)}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<ClipboardList className="size-5" />}
            title="No requests"
            description="Nothing matches this tab or search."
          />
        ) : null}
      </Card>

      <Drawer
        open={!!selected}
        onClose={closeDrawer}
        title={selected?.id ?? ""}
        subtitle={
          selected
            ? `${selected.employeeName} · ${selected.department ?? "Employee"}`
            : undefined
        }
        footer={
          selected && selectedStatus === "pending" ? (
            <>
              <Button
                variant="danger-outline"
                size="sm"
                onClick={() => {
                  setStatus(selected.id, "rejected");
                  closeDrawer();
                }}
              >
                Reject
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setStatus(selected.id, "approved");
                  closeDrawer();
                }}
              >
                Approve
              </Button>
            </>
          ) : (
            <Button variant="secondary" size="sm" onClick={closeDrawer}>
              Close
            </Button>
          )
        }
      >
        {selected && fare && selectedStatus ? (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Avatar initials={initials(selected.employeeName)} size="lg" />
              <div>
                <p className="text-sm font-semibold text-text">
                  {selected.employeeName}
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  {selected.employeePhone}
                </p>
              </div>
              <StatusBadge status={selectedStatus} className="ml-auto" />
            </div>

            {selected.aiAssisted ? (
              <div className="flex gap-2 rounded-[10px] border border-blue-200 bg-primary-soft/60 px-3 py-2.5">
                <Sparkles className="size-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-primary">
                    AI-assisted request
                  </p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Parsed from WhatsApp. Verify pickup, destination, and timing
                    before approving.
                  </p>
                </div>
              </div>
            ) : null}

            <dl className="space-y-3 text-sm">
              <Row label="Pickup" value={selected.pickup} />
              <Row label="Destination" value={selected.destination} />
              <Row label="Requested for" value={selected.requestedTime} />
              <Row label="Submitted" value={selected.createdAt} />
              <Row label="Channel" value={selected.channel} />
              <Row
                label="Distance"
                value={formatKm(selected.estimatedDistanceKm)}
              />
              {selected.assignedRider ? (
                <Row label="Assigned rider" value={selected.assignedRider} />
              ) : null}
              {selected.approvedBy ? (
                <Row
                  label="Approved by"
                  value={`${selected.approvedBy}${selected.approvedAt ? ` · ${selected.approvedAt}` : ""}`}
                />
              ) : null}
              {selected.notes ? (
                <Row label="Notes" value={selected.notes} />
              ) : null}
            </dl>

            <div className="rounded-[10px] border border-border p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-3">
                Fare breakdown
              </p>
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
                  <span>Estimated total</span>
                  <span>{formatRwf(fare.total)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-text-muted shrink-0">{label}</dt>
      <dd className="text-right font-medium text-text capitalize">{value}</dd>
    </div>
  );
}
