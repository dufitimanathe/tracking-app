"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, SearchInput, Select } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Avatar, Modal } from "@/components/ui/overlay";
import { employees as initialEmployees } from "@/data/mock";
import { formatRwf, initials } from "@/lib/utils";
import type { Employee } from "@/types";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    department: "Operations",
    employeeId: "",
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        e.employeeId.toLowerCase().includes(q),
    );
  }, [employees, query]);

  function handleAdd() {
    if (!form.name.trim() || !form.phone.trim()) return;
    const next: Employee = {
      id: `emp_${Date.now()}`,
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || `${form.name.split(" ")[0]?.toLowerCase() ?? "user"}@company.rw`,
      department: form.department,
      employeeId: form.employeeId.trim() || `EMP-${1000 + employees.length + 1}`,
      status: "active",
      tripsThisMonth: 0,
      transportCost: 0,
      lastRequest: "—",
    };
    setEmployees((prev) => [next, ...prev]);
    setForm({
      name: "",
      phone: "",
      email: "",
      department: "Operations",
      employeeId: "",
    });
    setOpen(false);
  }

  return (
    <div className="space-y-5 sm:space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        title="Employees"
        description="Company employees who can request transport."
        actions={
          <Button size="sm" leftIcon={<Plus className="size-3.5" />} onClick={() => setOpen(true)}>
            Add employee
          </Button>
        }
      />

      <Card padding="none" className="overflow-hidden">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 py-3 border-b border-border">
          <div>
            <h2 className="text-base font-semibold text-text">Employee directory</h2>
            <p className="text-xs text-text-muted mt-0.5">{filtered.length} employees</p>
          </div>
          <SearchInput
            placeholder="Search employees…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:w-72"
          />
        </div>

        <ul className="md:hidden divide-y divide-border">
          {filtered.map((emp) => (
            <li key={emp.id} className="p-4">
              <div className="flex items-start gap-3">
                <Avatar initials={initials(emp.name)} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-text">{emp.name}</p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {emp.employeeId} · {emp.department}
                      </p>
                    </div>
                    <StatusBadge
                      status={emp.status === "active" ? "available" : "offline"}
                      label={emp.status === "active" ? "Active" : "Inactive"}
                    />
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-text-secondary">
                    <span>{emp.tripsThisMonth} trips</span>
                    <span>{formatRwf(emp.transportCost)}</span>
                    <span className="col-span-2 truncate">{emp.email}</span>
                    <span className="col-span-2 text-text-muted">
                      Last request: {emp.lastRequest}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted/50 text-left text-xs uppercase tracking-wide text-text-muted">
                <th className="px-4 py-3 font-medium">Employee</th>
                <th className="px-4 py-3 font-medium">Department</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Trips</th>
                <th className="px-4 py-3 font-medium">Transport cost</th>
                <th className="px-4 py-3 font-medium">Last request</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((emp) => (
                <tr key={emp.id} className="hover:bg-surface-muted/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar initials={initials(emp.name)} size="sm" />
                      <div>
                        <p className="font-medium text-text">{emp.name}</p>
                        <p className="text-xs text-text-muted">
                          {emp.employeeId} · {emp.phone}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{emp.department}</td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={emp.status === "active" ? "available" : "offline"}
                      label={emp.status === "active" ? "Active" : "Inactive"}
                    />
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{emp.tripsThisMonth}</td>
                  <td className="px-4 py-3 font-medium text-text">
                    {formatRwf(emp.transportCost)}
                  </td>
                  <td className="px-4 py-3 text-text-muted">{emp.lastRequest}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add employee"
        description="Create a new employee profile for transport requests."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Save employee</Button>
          </>
        }
      >
        <div className="space-y-3">
          <Field label="Full name">
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Alice Uwimana"
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
              placeholder="alice@company.rw"
            />
          </Field>
          <Field label="Department">
            <Select
              value={form.department}
              onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
            >
              <option>Operations</option>
              <option>Finance</option>
              <option>HR</option>
              <option>Sales</option>
              <option>IT</option>
            </Select>
          </Field>
          <Field label="Employee ID" hint="Optional — auto-generated if blank">
            <Input
              value={form.employeeId}
              onChange={(e) => setForm((f) => ({ ...f, employeeId: e.target.value }))}
              placeholder="EMP-1200"
            />
          </Field>
        </div>
      </Modal>
    </div>
  );
}
