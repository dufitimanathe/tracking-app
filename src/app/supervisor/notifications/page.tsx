"use client";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { notifications } from "@/data/mock";
import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";

export default function SupervisorNotificationsPage() {
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-[800px] mx-auto space-y-4">
      <PageHeader
        title="Notifications"
        description={`${unread} unread · Dispatch and fleet updates for your zone.`}
      />

      <Card padding="none" className="overflow-hidden">
        <ul className="divide-y divide-border">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={cn("px-4 py-4", !n.read && "bg-primary-soft/30")}
            >
              <div className="flex gap-3">
                <div
                  className={cn(
                    "mt-0.5 rounded-[8px] p-2 shrink-0",
                    n.critical
                      ? "bg-danger-soft text-danger"
                      : "bg-surface-muted text-text-secondary",
                  )}
                >
                  <Bell className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-text">{n.title}</p>
                    {n.critical ? <StatusBadge status="critical" /> : null}
                    {!n.read ? (
                      <span className="size-1.5 rounded-full bg-primary" />
                    ) : null}
                  </div>
                  <p className="text-sm text-text-secondary mt-0.5">{n.description}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-text-muted">
                    <span className="capitalize">{n.category}</span>
                    {n.relatedEntity ? <span>· {n.relatedEntity}</span> : null}
                    <span>· {n.timestamp}</span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
