"use client";

import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState, PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { fetchMembers } from "@/lib/api/resources";
import { mapMemberToSupervisor } from "@/lib/api/mappers";
import { useAppSelector } from "@/store";
import type { Supervisor } from "@/types";
import { useCallback, useEffect, useState } from "react";

export default function SupervisorsPage() {
  const companyId = useAppSelector((s) => s.auth.companyId);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Supervisor[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchMembers(companyId, { page, limit: 20 });
      const supervisors = result.items
        .filter((m) => m.role === "SUPERVISOR" || m.role === "COMPANY_ADMIN")
        .map(mapMemberToSupervisor);
      setItems(supervisors);
      setTotal(result.meta.total);
      setTotalPages(result.meta.totalPages || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load members");
    } finally {
      setLoading(false);
    }
  }, [companyId, page]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-4 sm:space-y-5 max-w-[1200px] mx-auto">
      <PageHeader
        title="Supervisors & admins"
        description="Company members with supervisor or admin role"
      />
      {error ? (
        <p className="text-sm text-danger bg-danger-soft rounded-[8px] px-3 py-2">{error}</p>
      ) : null}
      <Card padding="none" className="overflow-hidden">
        {loading ? (
          <EmptyState title="Loading…" />
        ) : items.length === 0 ? (
          <EmptyState title="No supervisors found on this page" />
        ) : (
          <ul className="divide-y divide-border">
            {items.map((s) => (
              <li key={s.id} className="px-4 py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-text">{s.name}</p>
                  <p className="text-xs text-text-secondary">
                    {s.email} · {s.phone} · {s.department}
                  </p>
                </div>
                <StatusBadge status={s.status === "active" ? "available" : "offline"} label={s.status} />
              </li>
            ))}
          </ul>
        )}
        <div className="border-t border-border px-4 py-3">
          <Pagination page={page} totalPages={totalPages} total={total} onPageChange={setPage} />
        </div>
      </Card>
    </div>
  );
}
