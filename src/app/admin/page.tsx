"use client";

import { OpsMap } from "@/components/maps/ops-map";
import { Card, MetricCard } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  alerts,
  dashboardStats,
  motorcycles,
} from "@/data/mock";
import { formatKm, formatLongDate, formatRwf, greetingForHour } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import { setSelectedMotorcycleId } from "@/store/slices/ui-slice";
import {
  AlertTriangle,
  Bike,
  ClipboardList,
  MapPinned,
  Route,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";

export default function AdminOverviewPage() {
  const dispatch = useAppDispatch();
  const { userName } = useAppSelector((s) => s.auth);
  const selectedId = useAppSelector((s) => s.ui.selectedMotorcycleId);
  const s = dashboardStats;

  return (
    <div className="space-y-5 sm:space-y-6 max-w-[1400px] mx-auto">
      <div>
        <p className="text-sm text-text-secondary">
          {greetingForHour()}, {userName.split(" ")[0]}
        </p>
        <h1 className="text-xl sm:text-2xl font-semibold text-text tracking-tight mt-0.5">
          Company operational overview
        </h1>
        <p className="text-sm text-text-muted mt-1">{formatLongDate()}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard
          label="Active Trips"
          value={s.activeTrips}
          hint="Live now"
          accent="primary"
          icon={<MapPinned className="size-4" />}
        />
        <MetricCard
          label="Available Riders"
          value={`${s.availableRiders} / ${s.totalRiders}`}
          hint="Ready for assignment"
          accent="success"
          icon={<Users className="size-4" />}
        />
        <MetricCard
          label="Pending Approval"
          value={s.pendingRequests}
          hint="Needs attention"
          accent="warning"
          icon={<ClipboardList className="size-4" />}
        />
        <MetricCard
          label="Fleet Online"
          value={`${s.motorcyclesOnline} / ${s.totalMotorcycles}`}
          hint="GPS connected"
          accent="success"
          icon={<Bike className="size-4" />}
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard label="Trips Today" value={s.tripsToday} />
        <MetricCard
          label="Completed"
          value={s.completedToday}
          accent="success"
        />
        <MetricCard
          label="Distance"
          value={formatKm(s.distanceTodayKm)}
          icon={<Route className="size-4" />}
        />
        <MetricCard
          label="Transport Cost"
          value={formatRwf(s.transportCostToday)}
          icon={<Wallet className="size-4" />}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <Card className="xl:col-span-3 p-0 overflow-hidden" padding="none">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div>
              <h2 className="text-base font-semibold text-text">Live Operations Map</h2>
              <p className="text-xs text-text-muted mt-0.5">Fleet positions across Kigali</p>
            </div>
            <Link
              href="/admin/live"
              className="inline-flex h-8 items-center rounded-[8px] border border-border bg-surface px-3 text-xs font-medium text-text hover:bg-surface-muted"
            >
              Open command center
            </Link>
          </div>
          <div className="p-3 sm:p-4">
            <OpsMap
              motorcycles={motorcycles}
              selectedId={selectedId}
              onSelect={(m) => dispatch(setSelectedMotorcycleId(m.id))}
              className="h-[280px] sm:h-[360px]"
            />
          </div>
        </Card>

        <Card className="xl:col-span-2 p-0 overflow-hidden" padding="none">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div>
              <h2 className="text-base font-semibold text-text">Operational Alerts</h2>
              <p className="text-xs text-text-muted mt-0.5">What needs attention now</p>
            </div>
            <Link href="/admin/incidents" className="text-xs font-medium text-primary">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {alerts.map((alert) => (
              <li key={alert.id} className="px-4 py-3 hover:bg-surface-muted/60 transition-colors">
                <div className="flex gap-3">
                  <div
                    className={
                      alert.severity === "critical"
                        ? "mt-0.5 rounded-[8px] bg-danger-soft p-1.5 text-danger"
                        : alert.severity === "warning"
                          ? "mt-0.5 rounded-[8px] bg-warning-soft p-1.5 text-warning"
                          : "mt-0.5 rounded-[8px] bg-primary-soft p-1.5 text-primary"
                    }
                  >
                    <AlertTriangle className="size-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-text">{alert.title}</p>
                      <StatusBadge
                        status={
                          alert.severity === "critical"
                            ? "critical"
                            : alert.severity === "warning"
                              ? "warning"
                              : "info"
                        }
                        className="shrink-0"
                      />
                    </div>
                    <p className="text-xs text-text-secondary mt-0.5">{alert.subtitle}</p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-text-muted">{alert.meta}</span>
                      <button type="button" className="text-xs font-medium text-primary">
                        {alert.actionLabel}
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
