"use client";

import { Card } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Avatar } from "@/components/ui/overlay";
import { StatusBadge } from "@/components/ui/status-badge";
import { employees } from "@/data/mock";
import { formatRwf, initials } from "@/lib/utils";
import { useMemo, useState } from "react";

export default function SupervisorEmployeesPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        e.employeeId.toLowerCase().includes(q) ||
        e.phone.includes(q),
    );
  }, [query]);

  return (
    <div className="max-w-[1100px] mx-auto space-y-4">
      <PageHeader
        title="Employees"
        description="People whose transport requests you can approve."
      />

      <SearchInput
        placeholder="Search name, department, or employee ID..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="max-w-md"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((emp) => (
          <Card key={emp.id} padding="md">
            <div className="flex items-start gap-3">
              <Avatar initials={initials(emp.name)} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-text">{emp.name}</p>
                  <StatusBadge
                    status={emp.status === "active" ? "available" : "offline"}
                    label={emp.status === "active" ? "Active" : "Inactive"}
                  />
                </div>
                <p className="text-xs text-text-secondary mt-0.5">
                  {emp.department} · {emp.employeeId}
                </p>
                <p className="text-xs text-text-muted mt-1">{emp.phone}</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-[8px] bg-surface-muted px-2.5 py-2">
                    <p className="text-text-muted">Trips / month</p>
                    <p className="font-semibold text-text mt-0.5">
                      {emp.tripsThisMonth}
                    </p>
                  </div>
                  <div className="rounded-[8px] bg-surface-muted px-2.5 py-2">
                    <p className="text-text-muted">Cost</p>
                    <p className="font-semibold text-text mt-0.5">
                      {formatRwf(emp.transportCost)}
                    </p>
                  </div>
                </div>
                <p className="text-[11px] text-text-muted mt-2">
                  Last request: {emp.lastRequest}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
