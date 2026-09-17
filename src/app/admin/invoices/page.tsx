"use client";

import { Card } from "@/components/ui/card";
import { SearchInput, Select } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { invoices } from "@/data/mock";
import { formatRwf } from "@/lib/utils";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function InvoicesPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return invoices.filter((inv) => {
      const statusOk = status === "all" || inv.status === status;
      const queryOk =
        !q ||
        inv.number.toLowerCase().includes(q) ||
        inv.period.toLowerCase().includes(q);
      return statusOk && queryOk;
    });
  }, [query, status]);

  return (
    <div className="space-y-5 sm:space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        title="Invoices"
        description="Billing documents issued for company transport usage."
      />

      <Card padding="none" className="overflow-hidden">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 py-3 border-b border-border">
          <div>
            <h2 className="text-base font-semibold text-text">Invoice list</h2>
            <p className="text-xs text-text-muted mt-0.5">{filtered.length} invoices</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <SearchInput
              placeholder="Search invoice #…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full sm:w-56"
            />
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full sm:w-40"
            >
              <option value="all">All statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="draft">Draft</option>
            </Select>
          </div>
        </div>

        <ul className="md:hidden divide-y divide-border">
          {filtered.map((inv) => (
            <li key={inv.id}>
              <Link href={`/admin/invoices/${inv.id}`} className="block p-4 hover:bg-surface-muted/50">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-text">{inv.number}</p>
                    <p className="text-xs text-text-secondary mt-0.5">{inv.period}</p>
                  </div>
                  <StatusBadge status={inv.status} />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-text-secondary">
                  <span>{inv.trips} trips</span>
                  <span className="font-semibold text-text">{formatRwf(inv.amount)}</span>
                </div>
                <p className="mt-1 text-xs text-text-muted">
                  Issued {inv.issuedDate} · Due {inv.dueDate}
                </p>
              </Link>
            </li>
          ))}
          {filtered.length === 0 ? (
            <li className="px-4 py-10 text-center text-sm text-text-muted">
              No invoices match your filters.
            </li>
          ) : null}
        </ul>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted/50 text-left text-xs uppercase tracking-wide text-text-muted">
                <th className="px-4 py-3 font-medium">Invoice</th>
                <th className="px-4 py-3 font-medium">Period</th>
                <th className="px-4 py-3 font-medium">Trips</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Issued</th>
                <th className="px-4 py-3 font-medium">Due</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-surface-muted/40 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/invoices/${inv.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {inv.number}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{inv.period}</td>
                  <td className="px-4 py-3 text-text-secondary">{inv.trips}</td>
                  <td className="px-4 py-3 font-medium text-text">{formatRwf(inv.amount)}</td>
                  <td className="px-4 py-3 text-text-muted">{inv.issuedDate}</td>
                  <td className="px-4 py-3 text-text-muted">{inv.dueDate}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={inv.status} />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-text-muted">
                    No invoices match your filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
