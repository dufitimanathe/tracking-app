"use client";

import { Button } from "@/components/ui/button";
import { Card, MetricCard } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  company,
  invoices,
  monthlySpend,
  tripsByWeek,
} from "@/data/mock";
import { calculateFare, formatRwf } from "@/lib/utils";
import { FileText, Wallet } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export default function BillingPage() {
  const currentPeriod = invoices.find((i) => i.status === "pending") ?? invoices[0];
  const billed = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.amount, 0);
  const outstanding = invoices
    .filter((i) => i.status === "pending" || i.status === "overdue")
    .reduce((sum, i) => sum + i.amount, 0);
  const unbilled = 186400;

  const maxSpend = Math.max(...monthlySpend.map((m) => m.amount), 1);
  const maxTrips = Math.max(...tripsByWeek.map((w) => w.trips), 1);

  const fareExample = useMemo(() => calculateFare(6.3), []);

  return (
    <div className="space-y-5 sm:space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        title="Billing"
        description={`Transport spend and invoicing for ${company.name}.`}
        actions={
          <Link href="/admin/invoices">
            <Button variant="secondary" size="sm" leftIcon={<FileText className="size-3.5" />}>
              View invoices
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard
          label="Current period cost"
          value={formatRwf(currentPeriod.amount)}
          hint={currentPeriod.period}
          accent="primary"
          icon={<Wallet className="size-4" />}
        />
        <MetricCard
          label="Unbilled"
          value={formatRwf(unbilled)}
          hint="Trips not yet invoiced"
          accent="warning"
        />
        <MetricCard
          label="Billed"
          value={formatRwf(billed)}
          hint="Paid invoices"
          accent="success"
        />
        <MetricCard
          label="Outstanding"
          value={formatRwf(outstanding)}
          hint="Pending + overdue"
          accent="danger"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h2 className="text-base font-semibold text-text">Monthly spend</h2>
          <p className="text-xs text-text-muted mt-0.5">Last 6 months · {company.currency}</p>
          <div className="mt-5 flex items-end gap-2 sm:gap-3 h-40">
            {monthlySpend.map((m) => {
              const height = Math.max((m.amount / maxSpend) * 100, 6);
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] text-text-muted tabular-nums">
                    {(m.amount / 1_000_000).toFixed(1)}M
                  </span>
                  <div
                    className="w-full rounded-t-[6px] bg-primary/80 hover:bg-primary transition-colors"
                    style={{ height: `${height}%` }}
                    title={formatRwf(m.amount)}
                  />
                  <span className="text-xs font-medium text-text-secondary">{m.month}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <h2 className="text-base font-semibold text-text">Trips by week</h2>
          <p className="text-xs text-text-muted mt-0.5">Current billing period</p>
          <div className="mt-5 flex items-end gap-3 sm:gap-4 h-40">
            {tripsByWeek.map((w) => {
              const height = Math.max((w.trips / maxTrips) * 100, 6);
              return (
                <div key={w.week} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] text-text-muted tabular-nums">{w.trips}</span>
                  <div
                    className="w-full rounded-t-[6px] bg-success/70 hover:bg-success transition-colors"
                    style={{ height: `${height}%` }}
                    title={`${w.trips} trips`}
                  />
                  <span className="text-xs font-medium text-text-secondary">{w.week}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card padding="none" className="lg:col-span-3 overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-text">Recent invoices</h2>
              <p className="text-xs text-text-muted mt-0.5">Latest billing documents</p>
            </div>
            <Link href="/admin/invoices" className="text-xs font-medium text-primary">
              See all
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {invoices.map((inv) => (
              <li key={inv.id}>
                <Link
                  href={`/admin/invoices/${inv.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-surface-muted/50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text">{inv.number}</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {inv.period} · {inv.trips} trips
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-text">{formatRwf(inv.amount)}</p>
                    <div className="mt-1 flex justify-end">
                      <StatusBadge status={inv.status} />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="text-base font-semibold text-text">Pricing rule</h2>
          <p className="text-xs text-text-muted mt-0.5">Company transport fare structure</p>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-[8px] border border-border bg-surface-muted/40 px-3 py-2.5">
              <span className="text-text-secondary">First kilometre</span>
              <span className="font-semibold text-text">500 RWF</span>
            </div>
            <div className="flex items-center justify-between rounded-[8px] border border-border bg-surface-muted/40 px-3 py-2.5">
              <span className="text-text-secondary">Each additional km</span>
              <span className="font-semibold text-text">400 RWF</span>
            </div>
          </div>
          <div className="mt-5 rounded-[10px] border border-border p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
              Example · 6.3 km
            </p>
            <dl className="mt-2 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-text-secondary">First km</dt>
                <dd className="font-medium text-text">500 RWF</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-secondary">
                  Remaining {fareExample.remainingKm.toFixed(1)} km
                </dt>
                <dd className="font-medium text-text">
                  {formatRwf(fareExample.remainingCost)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-border pt-2 mt-2">
                <dt className="font-semibold text-text">Total</dt>
                <dd className="font-semibold text-primary">
                  {formatRwf(fareExample.total)}
                </dd>
              </div>
            </dl>
          </div>
        </Card>
      </div>
    </div>
  );
}
