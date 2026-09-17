"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OnboardingCompanyPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "Virunga Transport Ltd",
    phone: "+250 788 123 456",
    email: "ops@virunga.rw",
    address: "KG 7 Ave, Kacyiru, Kigali",
    currency: "RWF",
    timezone: "Africa/Kigali",
  });

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/onboarding/operations");
  }

  return (
    <Card className="shadow-[var(--shadow-soft)]" padding="lg">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-text tracking-tight">
          Company details
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          This becomes your FleetOps workspace identity.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Company name">
          <Input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            required
          />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Phone">
            <Input
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              required
            />
          </Field>
          <Field label="Ops email">
            <Input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
            />
          </Field>
        </div>
        <Field label="Address">
          <Input
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            required
          />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Currency">
            <Select
              value={form.currency}
              onChange={(e) => update("currency", e.target.value)}
            >
              <option value="RWF">RWF</option>
            </Select>
          </Field>
          <Field label="Timezone">
            <Select
              value={form.timezone}
              onChange={(e) => update("timezone", e.target.value)}
            >
              <option value="Africa/Kigali">Africa/Kigali</option>
            </Select>
          </Field>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2 sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/register")}
          >
            Back
          </Button>
          <Button type="submit">Continue</Button>
        </div>
      </form>
    </Card>
  );
}
