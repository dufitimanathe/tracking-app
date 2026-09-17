"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "./button";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: "md" | "lg";
}

export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = "md",
}: DrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close drawer"
        className="absolute inset-0 bg-slate-900/40"
        onClick={onClose}
      />
      <aside
        className={cn(
          "absolute inset-y-0 right-0 flex w-full flex-col bg-surface border-l border-border shadow-[var(--shadow-overlay)]",
          "animate-in slide-in-from-right duration-200",
          width === "md" ? "max-w-md" : "max-w-xl",
        )}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-4 sm:px-5">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-text truncate">{title}</h2>
            {subtitle ? (
              <p className="mt-0.5 text-sm text-text-secondary truncate">
                {subtitle}
              </p>
            ) : null}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close">
            <X className="size-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto panel-scroll px-4 py-4 sm:px-5">
          {children}
        </div>
        {footer ? (
          <div className="border-t border-border px-4 py-3 sm:px-5 flex flex-wrap gap-2 justify-end bg-surface">
            {footer}
          </div>
        ) : null}
      </aside>
    </div>
  );
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-slate-900/40"
        onClick={onClose}
      />
      <div className="relative z-10 w-full sm:max-w-md rounded-t-[16px] sm:rounded-[12px] border border-border bg-surface shadow-[var(--shadow-overlay)]">
        <div className="border-b border-border px-4 py-4 sm:px-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-text">{title}</h2>
              {description ? (
                <p className="mt-1 text-sm text-text-secondary">{description}</p>
              ) : null}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="size-4" />
            </Button>
          </div>
        </div>
        <div className="px-4 py-4 sm:px-5">{children}</div>
        {footer ? (
          <div className="border-t border-border px-4 py-3 sm:px-5 flex flex-wrap gap-2 justify-end">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function Timeline({
  steps,
}: {
  steps: { label: string; time?: string; done?: boolean; current?: boolean }[];
}) {
  return (
    <ol className="space-y-0">
      {steps.map((step, i) => (
        <li key={step.label} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span
              className={cn(
                "size-2.5 rounded-full mt-1.5 border-2",
                step.current
                  ? "border-primary bg-primary"
                  : step.done
                    ? "border-success bg-success"
                    : "border-border-strong bg-surface",
              )}
            />
            {i < steps.length - 1 ? (
              <span
                className={cn(
                  "w-px flex-1 min-h-6",
                  step.done ? "bg-success/40" : "bg-border",
                )}
              />
            ) : null}
          </div>
          <div className="pb-4 min-w-0">
            <p
              className={cn(
                "text-sm font-medium",
                step.current
                  ? "text-primary"
                  : step.done
                    ? "text-text"
                    : "text-text-muted",
              )}
            >
              {step.label}
            </p>
            {step.time ? (
              <p className="text-xs text-text-muted mt-0.5">{step.time}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Avatar({
  initials,
  size = "md",
  className,
}: {
  initials: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "size-7 text-[10px]",
    md: "size-9 text-xs",
    lg: "size-12 text-sm",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-primary-soft text-primary font-semibold shrink-0",
        sizes[size],
        className,
      )}
    >
      {initials}
    </span>
  );
}
