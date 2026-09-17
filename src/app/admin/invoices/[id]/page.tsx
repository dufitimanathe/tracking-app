"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { company, invoices } from "@/data/mock";
import { formatRwf } from "@/lib/utils";
import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const lineItems = [
  {
    id: "li1",
    tripId: "TRIP-2370",
    date: "16 Sep 2026",
    route: "Kicukiro → Remera",
    distanceKm: 5.6,
    amount: 2340,
  },
  {
    id: "li2",
    tripId: "TRIP-2362",
    date: "15 Sep 2026",
    route: "Gisozi → Kacyiru",
    distanceKm: 4.8,
    amount: 2020,
  },
  {
    id: "li3",
    tripId: "TRIP-2351",
    date: "14 Sep 2026",
    route: "Kimironko → Remera",
    distanceKm: 3.2,
    amount: 1380,
  },
  {
    id: "li4",
    tripId: "TRIP-2344",
    date: "13 Sep 2026",
    route: "Nyamirambo → Kacyiru",
    distanceKm: 7.1,
    amount: 2940,
  },
  {
    id: "li5",
    tripId: "TRIP-2338",
    date: "12 Sep 2026",
    route: "Remera → Gisozi",
    distanceKm: 6.0,
    amount: 2500,
  },
];

export default function InvoiceDetailPage() {
  const params = useParams<{ id: string }>();
  const invoice = invoices.find((i) => i.id === params.id) ?? invoices[0];

  const subtotal = lineItems.reduce((sum, row) => sum + row.amount, 0);
  const tax = 0;
  const total = invoice.amount;

  return (
    <div className="space-y-5 sm:space-y-6 max-w-[960px] mx-auto">
      <div>
        <Link
          href="/admin/invoices"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text mb-3"
        >
          <ArrowLeft className="size-4" />
          Back to invoices
        </Link>
        <PageHeader
          title={invoice.number}
          description={`Billing period ${invoice.period}`}
          actions={
            <Button size="sm" leftIcon={<Download className="size-3.5" />}>
              Download
            </Button>
          }
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={invoice.status} />
        <span className="text-xs text-text-muted">
          Issued {invoice.issuedDate} · Due {invoice.dueDate}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <h2 className="text-xs font-medium uppercase tracking-wide text-text-muted">
            Billed to
          </h2>
          <p className="mt-2 text-base font-semibold text-text">{company.name}</p>
          <p className="mt-1 text-sm text-text-secondary">{company.address}</p>
          <p className="mt-1 text-sm text-text-secondary">{company.email}</p>
          <p className="text-sm text-text-secondary">{company.phone}</p>
        </Card>
        <Card>
          <h2 className="text-xs font-medium uppercase tracking-wide text-text-muted">
            Invoice summary
          </h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-text-secondary">Trips</dt>
              <dd className="font-medium text-text">{invoice.trips}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-secondary">Currency</dt>
              <dd className="font-medium text-text">{company.currency}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-secondary">Period</dt>
              <dd className="font-medium text-text">{invoice.period}</dd>
            </div>
          </dl>
        </Card>
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-base font-semibold text-text">Trip line items</h2>
          <p className="text-xs text-text-muted mt-0.5">
            Sample of trips included in this invoice
          </p>
        </div>

        <ul className="md:hidden divide-y divide-border">
          {lineItems.map((row) => (
            <li key={row.id} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-text">{row.tripId}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{row.route}</p>
                </div>
                <p className="text-sm font-semibold text-text">{formatRwf(row.amount)}</p>
              </div>
              <p className="mt-2 text-xs text-text-muted">
                {row.date} · {row.distanceKm} km
              </p>
            </li>
          ))}
        </ul>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted/50 text-left text-xs uppercase tracking-wide text-text-muted">
                <th className="px-4 py-3 font-medium">Trip</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Route</th>
                <th className="px-4 py-3 font-medium">Distance</th>
                <th className="px-4 py-3 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {lineItems.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3 font-medium text-text">{row.tripId}</td>
                  <td className="px-4 py-3 text-text-secondary">{row.date}</td>
                  <td className="px-4 py-3 text-text-secondary">{row.route}</td>
                  <td className="px-4 py-3 text-text-secondary">{row.distanceKm} km</td>
                  <td className="px-4 py-3 text-right font-medium text-text">
                    {formatRwf(row.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-border px-4 py-4 space-y-2 text-sm max-w-sm ml-auto">
          <div className="flex justify-between">
            <span className="text-text-secondary">Sample subtotal</span>
            <span className="font-medium text-text">{formatRwf(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Tax</span>
            <span className="font-medium text-text">{formatRwf(tax)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2">
            <span className="font-semibold text-text">Invoice total</span>
            <span className="font-semibold text-primary text-base">{formatRwf(total)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
