"use client";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { notifications } from "@/data/mock";
import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";

export default function RiderNotificationsPage() {
  const riderNotes = notifications.filter(
    (n) =>
      n.category === "trip" ||
      n.category === "request" ||
      n.category === "gps" ||
      n.category === "rider" ||
      n.relatedEntity === "TRIP-2379",
  );
  const list = riderNotes.length > 0 ? riderNotes : notifications;

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <PageHeader
        title="Alerts"
        description="Trip assignments and GPS updates."
      />

      <Card padding="none" className="overflow-hidden">
        <ul className="divide-y divide-border">
          {list.map((n) => (
            <li
              key={n.id}
              className={cn("px-4 py-4", !n.read && "bg-primary-soft/30")}
            >
              <div className="flex gap-3">
                <div className="mt-0.5 rounded-[8px] bg-surface-muted p-2 text-text-secondary shrink-0">
                  <Bell className="size-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-text">{n.title}</p>
                    {n.critical ? <StatusBadge status="critical" /> : null}
                  </div>
                  <p className="text-sm text-text-secondary mt-0.5">{n.description}</p>
                  <p className="text-[11px] text-text-muted mt-1.5">{n.timestamp}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
