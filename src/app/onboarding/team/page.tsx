"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/input";
import { SkipForward, UserPlus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Mode = "choose" | "supervisor" | "rider";

export default function OnboardingTeamPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("choose");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  function goNext() {
    router.push("/onboarding/complete");
  }

  if (mode === "supervisor" || mode === "rider") {
    const title = mode === "supervisor" ? "Invite supervisor" : "Add rider";
    return (
      <Card className="shadow-[var(--shadow-soft)]" padding="lg">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-text tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-text-secondary">
            They&apos;ll get an invite to join your workspace.
          </p>
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            goNext();
          }}
        >
          <Field label="Full name">
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label="Phone">
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+250 788 000 000"
              required
            />
          </Field>
          <Field label="Email" hint="Optional">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>

          <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2 sm:justify-end">
            <Button type="button" variant="secondary" onClick={() => setMode("choose")}>
              Back
            </Button>
            <Button type="submit">Send invite & continue</Button>
          </div>
        </form>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-text tracking-tight">
          Build your team
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Invite a supervisor, add a rider, or skip and finish setup.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => setMode("supervisor")}
          className="rounded-[12px] border border-border bg-surface p-4 text-left shadow-[var(--shadow-soft)] hover:border-primary hover:bg-primary-soft/40 transition-colors"
        >
          <div className="rounded-[10px] bg-primary-soft p-2 text-primary w-fit">
            <UserPlus className="size-5" />
          </div>
          <p className="mt-3 text-sm font-semibold text-text">Invite supervisor</p>
          <p className="mt-1 text-xs text-text-secondary">
            Approve requests and manage dispatch
          </p>
        </button>

        <button
          type="button"
          onClick={() => setMode("rider")}
          className="rounded-[12px] border border-border bg-surface p-4 text-left shadow-[var(--shadow-soft)] hover:border-primary hover:bg-primary-soft/40 transition-colors"
        >
          <div className="rounded-[10px] bg-success-soft p-2 text-success w-fit">
            <Users className="size-5" />
          </div>
          <p className="mt-3 text-sm font-semibold text-text">Add rider</p>
          <p className="mt-1 text-xs text-text-secondary">
            Assign to a motorcycle after invite
          </p>
        </button>

        <button
          type="button"
          onClick={goNext}
          className="rounded-[12px] border border-border bg-surface p-4 text-left shadow-[var(--shadow-soft)] hover:border-border-strong transition-colors"
        >
          <div className="rounded-[10px] bg-surface-muted p-2 text-text-secondary w-fit">
            <SkipForward className="size-5" />
          </div>
          <p className="mt-3 text-sm font-semibold text-text">Skip</p>
          <p className="mt-1 text-xs text-text-secondary">
            Invite your team from the dashboard later
          </p>
        </button>
      </div>

      <div className="flex justify-start pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/onboarding/fleet")}
        >
          Back
        </Button>
      </div>
    </div>
  );
}
