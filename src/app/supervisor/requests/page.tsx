"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/input";
import { PageHeader, Tabs } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { requests } from "@/data/mock";
import { formatKm, formatRwf } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { useMemo, useState } from "react";

export default function SupervisorRequestsPage() {
  const [tab, setTab] = useState("pending");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState(requests);

  const filtered = useMemo(() => {
    return items.filter((r) => {
      const matchTab =
        tab === "all"
          ? true
          : tab === "pending"
            ? r.status === "pending"
            : r.status === tab;
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        r.employeeName.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.pickup.toLowerCase().includes(q) ||
        r.destination.toLowerCase().includes(q);
      return matchTab && matchQuery;
    });
  }, [items, tab, query]);

  const counts = {
    pending: items.filter((r) => r.status === "pending").length,
    approved: items.filter((r) => r.status === "approved").length,
    rejected: items.filter((r) => r.status === "rejected").length,
    all: items.length,
  };

  function decide(id: string, status: "approved" | "rejected") {
    setItems((list) =>
      list.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              approvedBy: status === "approved" ? "Eric Habimana" : r.approvedBy,
              approvedAt:
                status === "approved" ? "Today · just now" : r.approvedAt,
            }
          : r,
      ),
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto space-y-4">
      <PageHeader
        title="Transport requests"
        description="Review employee requests for your zone. Approve to queue rider assignment."
      />

      <Card padding="none" className="overflow-hidden">
        <div className="px-4 pt-3">
          <Tabs
            tabs={[
              { id: "pending", label: "Pending", count: counts.pending },
              { id: "approved", label: "Approved", count: counts.approved },
              { id: "rejected", label: "Rejected", count: counts.rejected },
              { id: "all", label: "All", count: counts.all },
            ]}
            active={tab}
            onChange={setTab}
          />
        </div>
        <div className="p-4 border-b border-border">
          <SearchInput
            placeholder="Search employee, route, or request ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <ul className="divide-y divide-border">
          {filtered.length === 0 ? (
            <li className="px-4 py-10 text-center text-sm text-text-secondary">
              No requests in this view
            </li>
          ) : (
            filtered.map((req) => (
              <li key={req.id} className="px-4 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono text-text-muted">{req.id}</span>
                      <StatusBadge status={req.status} />
                      {req.department ? (
                        <span className="text-xs text-text-muted">{req.department}</span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm font-semibold text-text">
                      {req.employeeName}
                    </p>
                    <p className="text-sm text-text-secondary mt-0.5">
                      {req.pickup} → {req.destination}
                    </p>
                    <p className="text-xs text-text-muted mt-1.5">
                      Requested {req.requestedTime} · {formatKm(req.estimatedDistanceKm)} ·{" "}
                      {formatRwf(req.estimatedCost)} · via {req.channel}
                    </p>
                    {req.notes ? (
                      <p className="mt-2 text-xs text-danger">{req.notes}</p>
                    ) : null}
                    {req.assignedRider ? (
                      <p className="mt-1 text-xs text-text-secondary">
                        Rider: {req.assignedRider}
                      </p>
                    ) : null}
                  </div>

                  {req.status === "pending" ? (
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        leftIcon={<Check className="size-3.5" />}
                        onClick={() => decide(req.id, "approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger-outline"
                        leftIcon={<X className="size-3.5" />}
                        onClick={() => decide(req.id, "rejected")}
                      >
                        Reject
                      </Button>
                    </div>
                  ) : null}
                </div>
              </li>
            ))
          )}
        </ul>
      </Card>
    </div>
  );
}
