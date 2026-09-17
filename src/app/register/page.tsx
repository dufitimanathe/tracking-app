"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/onboarding/company");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-[420px]">
        <p className="text-center text-xs font-semibold tracking-[0.14em] uppercase text-text-muted mb-6">
          FleetOps
        </p>

        <Card className="shadow-[var(--shadow-soft)]" padding="lg">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-text tracking-tight">
              Create your account
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Start setting up your company transport workspace
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Full name">
              <Input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Marie Uwase"
                required
              />
            </Field>
            <Field label="Work email">
              <Input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="admin@company.rw"
                required
              />
            </Field>
            <Field label="Phone">
              <Input
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="+250 788 000 000"
                required
              />
            </Field>
            <Field label="Password" hint="At least 8 characters">
              <Input
                type="password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                required
                minLength={8}
              />
            </Field>

            <Button type="submit" fullWidth size="lg">
              Continue
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-text-secondary">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
