"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { riders } from "@/data/mock";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

interface FormState {
  plate: string;
  fleetNumber: string;
  brand: string;
  model: string;
  year: string;
  color: string;
  engineCc: string;
  fuelType: string;
  chassisNumber: string;
  registrationExpiry: string;
  gpsDeviceId: string;
  gpsProvider: string;
  riderId: string;
  notes: string;
}

const initial: FormState = {
  plate: "",
  fleetNumber: "",
  brand: "TVS",
  model: "",
  year: "2024",
  color: "Black",
  engineCc: "150",
  fuelType: "petrol",
  chassisNumber: "",
  registrationExpiry: "",
  gpsDeviceId: "",
  gpsProvider: "TrackSolid",
  riderId: "",
  notes: "",
};

export default function NewMotorcyclePage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initial);
  const [saving, setSaving] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    // Mock save — return to fleet list
    window.setTimeout(() => {
      setSaving(false);
      router.push("/admin/fleet");
    }, 400);
  }

  return (
    <div className="space-y-4 sm:space-y-5 max-w-3xl mx-auto">
      <PageHeader
        title="Add Motorcycle"
        description="Register a new unit in the Virunga Transport fleet"
        actions={
          <Link
            href="/admin/fleet"
            className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-border bg-surface px-3 text-xs font-medium text-text hover:bg-surface-muted"
          >
            <ArrowLeft className="size-3.5" />
            Back
          </Link>
        }
      />

      <form onSubmit={onSubmit} className="space-y-4">
        <Card>
          <h2 className="text-sm font-semibold text-text mb-4">Identity</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Plate number" hint="e.g. RAE 428C">
              <Input
                required
                value={form.plate}
                onChange={(e) => update("plate", e.target.value)}
                placeholder="RAX 000A"
              />
            </Field>
            <Field label="Fleet number" hint="Internal ID">
              <Input
                required
                value={form.fleetNumber}
                onChange={(e) => update("fleetNumber", e.target.value)}
                placeholder="VT-032"
              />
            </Field>
            <Field label="Brand">
              <Select
                value={form.brand}
                onChange={(e) => update("brand", e.target.value)}
              >
                <option value="TVS">TVS</option>
                <option value="Bajaj">Bajaj</option>
                <option value="Honda">Honda</option>
                <option value="Yamaha">Yamaha</option>
                <option value="Other">Other</option>
              </Select>
            </Field>
            <Field label="Model">
              <Input
                required
                value={form.model}
                onChange={(e) => update("model", e.target.value)}
                placeholder="Apache 160"
              />
            </Field>
          </div>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold text-text mb-4">Specs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Year">
              <Input
                type="number"
                min={2015}
                max={2030}
                value={form.year}
                onChange={(e) => update("year", e.target.value)}
              />
            </Field>
            <Field label="Color">
              <Input
                value={form.color}
                onChange={(e) => update("color", e.target.value)}
              />
            </Field>
            <Field label="Engine (cc)">
              <Input
                value={form.engineCc}
                onChange={(e) => update("engineCc", e.target.value)}
              />
            </Field>
            <Field label="Fuel type">
              <Select
                value={form.fuelType}
                onChange={(e) => update("fuelType", e.target.value)}
              >
                <option value="petrol">Petrol</option>
                <option value="electric">Electric</option>
              </Select>
            </Field>
          </div>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold text-text mb-4">
            Registration & GPS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Chassis number">
              <Input
                value={form.chassisNumber}
                onChange={(e) => update("chassisNumber", e.target.value)}
                placeholder="MD2A21…"
              />
            </Field>
            <Field label="Registration expiry">
              <Input
                type="date"
                value={form.registrationExpiry}
                onChange={(e) => update("registrationExpiry", e.target.value)}
              />
            </Field>
            <Field label="GPS device ID">
              <Input
                value={form.gpsDeviceId}
                onChange={(e) => update("gpsDeviceId", e.target.value)}
                placeholder="IMEI / device serial"
              />
            </Field>
            <Field label="GPS provider">
              <Select
                value={form.gpsProvider}
                onChange={(e) => update("gpsProvider", e.target.value)}
              >
                <option value="TrackSolid">TrackSolid</option>
                <option value="Queclink">Queclink</option>
                <option value="Other">Other</option>
              </Select>
            </Field>
          </div>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold text-text mb-4">Assignment</h2>
          <Field
            label="Assign rider"
            hint="Optional — can assign later from Live Ops"
          >
            <Select
              value={form.riderId}
              onChange={(e) => update("riderId", e.target.value)}
            >
              <option value="">Unassigned</option>
              {riders.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} · {r.phone}
                </option>
              ))}
            </Select>
          </Field>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold text-text mb-4">Notes</h2>
          <Field label="Internal notes">
            <Textarea
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="Maintenance history, depot, insurance notes…"
            />
          </Field>
        </Card>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pb-6">
          <Link href="/admin/fleet" className="w-full sm:w-auto">
            <Button type="button" variant="secondary" fullWidth>
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={saving} fullWidth className="sm:w-auto">
            {saving ? "Saving…" : "Save motorcycle"}
          </Button>
        </div>
      </form>
    </div>
  );
}
