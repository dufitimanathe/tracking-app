"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Avatar, Modal } from "@/components/ui/overlay";
import { supervisors as initialSupervisors } from "@/data/mock";
import { cn, initials } from "@/lib/utils";
import type { Supervisor } from "@/types";
import { Plus, Shield } from "lucide-react";
import { useState } from "react";

const PERMISSION_OPTIONS = [
  "Approve requests",
  "Assign riders",
  "View fleet",
  "Reports",
  "Manage incidents",
];

export default function SupervisorsPage() {
  const [supervisors, setSupervisors] = useState<Supervisor[]>(initialSupervisors);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    department: "Dispatch",
    permissions: ["Approve requests", "Assign riders"] as string[],
  });

  function togglePermission(perm: string) {
    setForm((f) => ({
      ...f,
      permissions: f.permissions.includes(perm)
        ? f.permissions.filter((p) => p !== perm)
        : [...f.permissions, perm],
    }));
  }

  function handleAdd() {
    if (!form.name.trim() || !form.phone.trim()) return;
    const next: Supervisor = {
      id: `sup_${Date.now()}`,
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || `${form.name.split(" ")[0]?.toLowerCase() ?? "sup"}@virunga.rw`,
      department: form.department,
      employeesManaged: 0,
      pendingRequests: 0,
      status: "active",
      lastActive: "Just now",
      permissions: form.permissions,
    };
    setSupervisors((prev) => [next, ...prev]);
    setForm({
      name: "",
      phone: "",
      email: "",
      department: "Dispatch",
      permissions: ["Approve requests", "Assign riders"],
    });
    setOpen(false);
  }

  return (
    <div className="space-y-5 sm:space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        title="Supervisors"
        description="Dispatch supervisors and their operational permissions."
        actions={
          <Button size="sm" leftIcon={<Plus className="size-3.5" />} onClick={() => setOpen(true)}>
            Add supervisor
          </Button>
        }
      />

      <Card padding="none" className="overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center gap-2">
          <Shield className="size-4 text-primary" />
          <div>
            <h2 className="text-base font-semibold text-text">Supervisor list</h2>
            <p className="text-xs text-text-muted mt-0.5">{supervisors.length} active roles</p>
          </div>
        </div>

        <ul className="md:hidden divide-y divide-border">
          {supervisors.map((sup) => (
            <li key={sup.id} className="p-4">
              <div className="flex items-start gap-3">
                <Avatar initials={initials(sup.name)} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-text">{sup.name}</p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {sup.department} · {sup.employeesManaged} employees
                      </p>
                    </div>
                    <StatusBadge
                      status={sup.status === "active" ? "available" : "offline"}
                      label={sup.status === "active" ? "Active" : "Inactive"}
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {sup.permissions.map((p) => (
                      <span
                        key={p}
                        className="inline-flex rounded-full border border-border bg-surface-muted px-2 py-0.5 text-[11px] text-text-secondary"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-text-muted">
                    {sup.pendingRequests} pending · Last active {sup.lastActive}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted/50 text-left text-xs uppercase tracking-wide text-text-muted">
                <th className="px-4 py-3 font-medium">Supervisor</th>
                <th className="px-4 py-3 font-medium">Department</th>
                <th className="px-4 py-3 font-medium">Managed</th>
                <th className="px-4 py-3 font-medium">Pending</th>
                <th className="px-4 py-3 font-medium">Permissions</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {supervisors.map((sup) => (
                <tr key={sup.id} className="hover:bg-surface-muted/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar initials={initials(sup.name)} size="sm" />
                      <div>
                        <p className="font-medium text-text">{sup.name}</p>
                        <p className="text-xs text-text-muted">{sup.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{sup.department}</td>
                  <td className="px-4 py-3 text-text-secondary">{sup.employeesManaged}</td>
                  <td className="px-4 py-3 text-text-secondary">{sup.pendingRequests}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {sup.permissions.map((p) => (
                        <span
                          key={p}
                          className="inline-flex rounded-full border border-border bg-surface-muted px-2 py-0.5 text-[11px] text-text-secondary"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={sup.status === "active" ? "available" : "offline"}
                      label={sup.status === "active" ? "Active" : "Inactive"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add supervisor"
        description="Grant dispatch permissions for a new supervisor."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Save supervisor</Button>
          </>
        }
      >
        <div className="space-y-3">
          <Field label="Full name">
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Eric Habimana"
            />
          </Field>
          <Field label="Phone">
            <Input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="+250 788 000 000"
            />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="eric@virunga.rw"
            />
          </Field>
          <Field label="Department">
            <Select
              value={form.department}
              onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
            >
              <option>Dispatch</option>
              <option>East Zone</option>
              <option>West Zone</option>
              <option>Central</option>
            </Select>
          </Field>
          <Field label="Permissions">
            <div className="flex flex-wrap gap-2">
              {PERMISSION_OPTIONS.map((perm) => {
                const active = form.permissions.includes(perm);
                return (
                  <button
                    key={perm}
                    type="button"
                    onClick={() => togglePermission(perm)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                      active
                        ? "border-primary bg-primary-soft text-primary"
                        : "border-border bg-surface text-text-secondary hover:bg-surface-muted",
                    )}
                  >
                    {perm}
                  </button>
                );
              })}
            </div>
          </Field>
        </div>
      </Modal>
    </div>
  );
}
