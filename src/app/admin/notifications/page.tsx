"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader, Tabs } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { notifications as initialNotifications } from "@/data/mock";
import { cn } from "@/lib/utils";
import type { NotificationItem } from "@/types";
import { Bell, CheckCheck } from "lucide-react";
import { useMemo, useState } from "react";

const categories = [
  "all",
  "incident",
  "request",
  "trip",
  "billing",
  "gps",
  "fleet",
  "system",
] as const;

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>(initialNotifications);
  const [category, setCategory] = useState<string>("all");

  const filtered = useMemo(() => {
    if (category === "all") return items;
    return items.filter((n) => n.category === category);
  }, [items, category]);

  const unread = items.filter((n) => !n.read).length;

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function toggleRead(id: string) {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)),
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6 max-w-[900px] mx-auto">
      <PageHeader
        title="Notifications"
        description="Operational alerts across fleet, trips, requests, and billing."
        actions={
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<CheckCheck className="size-3.5" />}
            onClick={markAllRead}
            disabled={unread === 0}
          >
            Mark all read
          </Button>
        }
      />

      <Card padding="none" className="overflow-hidden">
        <div className="px-4 pt-3 border-b border-border">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="size-4 text-primary" />
            <p className="text-sm text-text-secondary">
              {unread} unread · {items.length} total
            </p>
          </div>
          <Tabs
            tabs={categories.map((c) => ({
              id: c,
              label: c === "all" ? "All" : c.charAt(0).toUpperCase() + c.slice(1),
              count:
                c === "all"
                  ? items.length
                  : items.filter((n) => n.category === c).length,
            }))}
            active={category}
            onChange={setCategory}
          />
        </div>

        <ul className="divide-y divide-border">
          {filtered.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => toggleRead(n.id)}
                className={cn(
                  "w-full text-left px-4 py-4 transition-colors hover:bg-surface-muted/50",
                  !n.read && "bg-primary-soft/30",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p
                        className={cn(
                          "text-sm text-text",
                          !n.read ? "font-semibold" : "font-medium",
                        )}
                      >
                        {n.title}
                      </p>
                      {n.critical ? <StatusBadge status="critical" label="Critical" /> : null}
                      <StatusBadge status="info" label={n.category} showDot={false} />
                    </div>
                    <p className="mt-1 text-sm text-text-secondary">{n.description}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-text-muted">
                      <span>{n.timestamp}</span>
                      {n.relatedEntity ? (
                        <>
                          <span>·</span>
                          <span>{n.relatedEntity}</span>
                        </>
                      ) : null}
                      <span>·</span>
                      <span>{n.read ? "Read" : "Unread"}</span>
                    </div>
                  </div>
                  {!n.read ? (
                    <span className="mt-1 size-2 rounded-full bg-primary shrink-0" aria-hidden />
                  ) : null}
                </div>
              </button>
            </li>
          ))}
          {filtered.length === 0 ? (
            <li className="px-4 py-12 text-center text-sm text-text-muted">
              No notifications in this category.
            </li>
          ) : null}
        </ul>
      </Card>
    </div>
  );
}
