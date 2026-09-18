"use client";

import { Card, MetricCard } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState, PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { fetchEmployees } from "@/lib/api/resources";
import { mapEmployee } from "@/lib/api/mappers";
import { useAppSelector } from "@/store";
import type { Employee } from "@/types";
import { Building2, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function EmployeesPage() {
  const companyId = useAppSelector((s) => s.auth.companyId);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchEmployees(companyId, {
        page,
        limit: 20,
        search: search || undefined,
        sort: "createdAt:DESC",
      });
      setItems(result.items.map(mapEmployee));
      setTotal(result.meta.total);
      setTotalPages(result.meta.totalPages || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load employees");
    } finally {
      setLoading(false);
    }
  }, [companyId, page, search]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-4 sm:space-y-5 max-w-[1400px] mx-auto">
      <PageHeader title="Employees" description="People who can request transport" />

      <div className="grid grid-cols-2 gap-3 max-w-md">
        <MetricCard label="Total" value={total} icon={<Users className="size-4" />} />
        <MetricCard
          label="Active (page)"
          value={items.filter((e) => e.status === "active").length}
          accent="success"
          icon={<Building2 className="size-4" />}
        />
      </div>

      <SearchInput
        placeholder="Search name, phone, department…"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="max-w-md"
      />

      {error ? (
        <p className="text-sm text-danger bg-danger-soft rounded-[8px] px-3 py-2">{error}</p>
      ) : null}

      <Card padding="none" className="overflow-hidden">
        {loading ? (
          <EmptyState title="Loading employees…" />
        ) : items.length === 0 ? (
          <EmptyState title="No employees" />
        ) : (
          <ul className="divide-y divide-border">
            {items.map((e) => (
              <li key={e.id} className="px-4 py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-text">{e.name}</p>
                  <p className="text-xs text-text-secondary">
                    {e.department} · {e.phone} · {e.employeeId}
                  </p>
                </div>
                <StatusBadge status={e.status === "active" ? "available" : "offline"} label={e.status} />
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
