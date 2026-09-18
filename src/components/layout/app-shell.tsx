"use client";

import { Avatar } from "@/components/ui/overlay";
import { LiveIndicator } from "@/components/ui/page-header";
import { navForRole, roleLabel, type NavItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setNotificationsOpen,
  setSearchOpen,
  setSidebarOpen,
  toggleSidebarCollapsed,
} from "@/store/slices/ui-slice";
import {
  Bell,
  ChevronsLeft,
  ChevronsRight,
  Command,
  HelpCircle,
  Menu,
  Search,
  Settings,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { fetchNotifications } from "@/lib/api/resources";
import { mapNotification } from "@/lib/api/mappers";
import type { NotificationItem } from "@/types";

function NavLink({
  item,
  collapsed,
  badgeCount,
  onNavigate,
}: {
  item: NavItem;
  collapsed?: boolean;
  badgeCount?: number;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active =
    item.href === "/admin" || item.href === "/supervisor" || item.href === "/rider"
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "group flex items-center gap-3 rounded-[8px] px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-primary-soft text-primary"
          : "text-text-secondary hover:bg-surface-muted hover:text-text",
        collapsed && "justify-center px-2",
      )}
      title={collapsed ? item.label : undefined}
    >
      <Icon className={cn("size-4 shrink-0", active ? "text-primary" : "text-text-muted")} />
      {!collapsed ? (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {badgeCount && badgeCount > 0 ? (
            <span className="rounded-full bg-warning-soft text-warning text-[10px] font-semibold px-1.5 py-0.5">
              {badgeCount}
            </span>
          ) : null}
        </>
      ) : null}
    </Link>
  );
}

function SidebarContent({
  collapsed,
  onNavigate,
  unread,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
  unread: number;
}) {
  const dispatch = useAppDispatch();
  const { role, companyName, companyInitials } = useAppSelector((s) => s.auth);
  const nav = navForRole(role);

  return (
    <div className="flex h-full flex-col">
      <div className={cn("border-b border-border px-4 py-4", collapsed && "px-2")}>
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="size-10 rounded-[10px] bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
            {companyInitials}
          </div>
          {!collapsed ? (
            <div className="min-w-0">
              <p className="text-sm font-semibold text-text truncate">{companyName}</p>
              <p className="text-xs text-text-muted">Company Workspace</p>
            </div>
          ) : null}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto panel-scroll px-2 py-3 space-y-0.5">
        {nav.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            collapsed={collapsed}
            badgeCount={
              item.badge === "pending"
                ? undefined
                : item.badge === "incidents"
                  ? undefined
                  : item.label === "Notifications"
                    ? unread
                    : undefined
            }
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className={cn("border-t border-border p-2 space-y-0.5", collapsed && "items-center")}>
        <Link
          href={role === "RIDER" ? "/rider/profile" : "/admin/settings"}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-[8px] px-3 py-2 text-sm text-text-secondary hover:bg-surface-muted",
            collapsed && "justify-center px-2",
          )}
        >
          <HelpCircle className="size-4" />
          {!collapsed ? "Help" : null}
        </Link>
        <Link
          href={role === "RIDER" ? "/rider/profile" : "/admin/settings"}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-[8px] px-3 py-2 text-sm text-text-secondary hover:bg-surface-muted",
            collapsed && "justify-center px-2",
          )}
        >
          <Settings className="size-4" />
          {!collapsed ? "Settings" : null}
        </Link>
        <button
          type="button"
          onClick={() => dispatch(toggleSidebarCollapsed())}
          className={cn(
            "hidden lg:flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-sm text-text-secondary hover:bg-surface-muted",
            collapsed && "justify-center px-2",
          )}
        >
          {collapsed ? (
            <ChevronsRight className="size-4" />
          ) : (
            <>
              <ChevronsLeft className="size-4" />
              Collapse
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function TopHeader({
  title,
  notifications,
}: {
  title?: string;
  notifications: NotificationItem[];
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { userName, avatarInitials, role } = useAppSelector((s) => s.auth);
  const { notificationsOpen, searchOpen } = useAppSelector((s) => s.ui);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur-sm">
      <div className="flex h-14 items-center gap-2 px-3 sm:px-5">
        <button
          type="button"
          className="lg:hidden rounded-[8px] p-2 text-text-secondary hover:bg-surface-muted"
          onClick={() => dispatch(setSidebarOpen(true))}
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>

        <div className="min-w-0 flex-1">
          {title ? (
            <p className="text-sm font-semibold text-text truncate sm:text-base">{title}</p>
          ) : (
            <div className="hidden sm:block relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
              <input
                placeholder="Search trips, plates, riders..."
                className="h-9 w-full rounded-[8px] border border-border bg-surface-muted/60 pl-9 pr-16 text-sm outline-none focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15"
                onFocus={() => dispatch(setSearchOpen(true))}
              />
              <kbd className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:inline-flex items-center gap-0.5 rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] text-text-muted">
                <Command className="size-2.5" />K
              </kbd>
            </div>
          )}
        </div>

        <button
          type="button"
          className="sm:hidden rounded-[8px] p-2 text-text-secondary hover:bg-surface-muted"
          onClick={() => dispatch(setSearchOpen(true))}
          aria-label="Search"
        >
          <Search className="size-5" />
        </button>

        <LiveIndicator />

        <div className="relative">
          <button
            type="button"
            className="relative rounded-[8px] p-2 text-text-secondary hover:bg-surface-muted"
            onClick={() => dispatch(setNotificationsOpen(!notificationsOpen))}
            aria-label="Notifications"
          >
            <Bell className="size-5" />
            {unread > 0 ? (
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-danger" />
            ) : null}
          </button>
          {notificationsOpen ? (
            <div className="absolute right-0 mt-2 w-[min(100vw-1.5rem,22rem)] rounded-[12px] border border-border bg-surface shadow-[var(--shadow-overlay)] overflow-hidden">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <p className="text-sm font-semibold">Notifications</p>
                <button
                  type="button"
                  className="text-xs text-primary font-medium"
                  onClick={() => {
                    dispatch(setNotificationsOpen(false));
                    router.push(
                      role === "RIDER"
                        ? "/rider/notifications"
                        : role === "SUPERVISOR"
                          ? "/supervisor/notifications"
                          : "/admin/notifications",
                    );
                  }}
                >
                  View all
                </button>
              </div>
              <ul className="max-h-80 overflow-y-auto panel-scroll">
                {notifications.slice(0, 5).map((n) => (
                  <li
                    key={n.id}
                    className={cn(
                      "border-b border-border px-4 py-3 last:border-0",
                      !n.read && "bg-primary-soft/40",
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {!n.read ? (
                        <span className="mt-1.5 size-1.5 rounded-full bg-primary shrink-0" />
                      ) : (
                        <span className="mt-1.5 size-1.5 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-text">{n.title}</p>
                        <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">
                          {n.description}
                        </p>
                        <p className="text-[11px] text-text-muted mt-1">{n.timestamp}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="hidden sm:flex items-center gap-2 pl-1 border-l border-border ml-1">
          <Avatar initials={avatarInitials} size="sm" />
          <div className="hidden md:block min-w-0">
            <p className="text-sm font-medium text-text truncate max-w-[120px]">
              {userName}
            </p>
            <p className="text-[11px] text-text-muted">{roleLabel(role)}</p>
          </div>
        </div>
      </div>

      {/* Session strip */}
      <div className="border-t border-border bg-surface-muted/50 px-3 sm:px-5 py-1.5 flex items-center gap-2">
        <span className="text-[11px] text-text-muted">
          Signed in via API · {roleLabel(role)}
        </span>
      </div>

      {searchOpen ? (
        <div className="absolute inset-x-0 top-14 z-40 border-b border-border bg-surface p-3 sm:hidden">
          <div className="flex gap-2">
            <input
              autoFocus
              placeholder="Search trips, plates, riders..."
              className="h-10 flex-1 rounded-[8px] border border-border px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
            <button
              type="button"
              className="rounded-[8px] p-2 hover:bg-surface-muted"
              onClick={() => dispatch(setSearchOpen(false))}
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="mt-3 space-y-2 text-sm">
            <p className="text-xs font-semibold text-text-muted uppercase">Motorcycles</p>
            <p className="text-text">RAE 428C</p>
            <p className="text-xs font-semibold text-text-muted uppercase pt-1">Riders</p>
            <p className="text-text">Jean Claude</p>
            <p className="text-xs font-semibold text-text-muted uppercase pt-1">Trips</p>
            <p className="text-text">TRIP-2381</p>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export function AppShell({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  const dispatch = useAppDispatch();
  const { sidebarOpen, sidebarCollapsed } = useAppSelector((s) => s.ui);
  const { role, companyId } = useAppSelector((s) => s.auth);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (!companyId) return;
    let cancelled = false;
    void fetchNotifications(companyId, { page: 1, limit: 20 })
      .then((res) => {
        if (!cancelled) setNotifications(res.items.map(mapNotification));
      })
      .catch(() => {
        if (!cancelled) setNotifications([]);
      });
    return () => {
      cancelled = true;
    };
  }, [companyId]);

  // Rider uses bottom nav on mobile; sidebar only from lg+
  const isRider = role === "RIDER";
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-background flex">
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r border-border bg-surface sticky top-0 h-screen shrink-0 transition-[width] duration-200",
          isRider
            ? "w-[220px]"
            : sidebarCollapsed
              ? "w-[72px]"
              : "w-[260px]",
        )}
      >
        <SidebarContent collapsed={!isRider && sidebarCollapsed} unread={unread} />
      </aside>

      {/* Mobile drawer */}
      {sidebarOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40"
            aria-label="Close menu"
            onClick={() => dispatch(setSidebarOpen(false))}
          />
          <aside className="absolute inset-y-0 left-0 w-[min(100%,280px)] bg-surface border-r border-border shadow-[var(--shadow-overlay)]">
            <SidebarContent
              onNavigate={() => dispatch(setSidebarOpen(false))}
              unread={unread}
            />
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <TopHeader title={title} notifications={notifications} />
        <main
          className={cn(
            "flex-1 px-3 py-4 sm:px-5 sm:py-6",
            isRider && "pb-24 lg:pb-6",
          )}
        >
          {children}
        </main>

        {isRider ? (
          <nav className="fixed bottom-0 inset-x-0 z-30 border-t border-border bg-surface lg:hidden safe-bottom">
            <div className="grid grid-cols-5 h-16">
              {navForRole("RIDER").map((item) => (
                <RiderTab key={item.href} item={item} />
              ))}
            </div>
          </nav>
        ) : null}
      </div>
    </div>
  );
}

function RiderTab({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const active =
    item.href === "/rider"
      ? pathname === "/rider"
      : pathname.startsWith(item.href);
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium",
        active ? "text-primary" : "text-text-muted",
      )}
    >
      <Icon className="size-5" />
      {item.label}
    </Link>
  );
}
