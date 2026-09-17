"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/input";
import { Bike, FileUp, SkipForward } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OnboardingFleetPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"choose" | "add">("choose");
  const [plate, setPlate] = useState("");
  const [fleetNumber, setFleetNumber] = useState("");
  const [brand, setBrand] = useState("");

  function goNext() {
    router.push("/onboarding/team");
  }

  if (mode === "add") {
    return (
      <Card className="shadow-[var(--shadow-soft)]" padding="lg">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-text tracking-tight">
            Add motorcycle
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            You can add more units after onboarding.
          </p>
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            goNext();
          }}
        >
          <Field label="Plate number">
            <Input
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
              placeholder="RAE 428C"
              required
            />
          </Field>
          <Field label="Fleet number">
            <Input
              value={fleetNumber}
              onChange={(e) => setFleetNumber(e.target.value)}
              placeholder="VT-014"
            />
          </Field>
          <Field label="Brand / model">
            <Input
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="TVS Apache 160"
            />
          </Field>

          <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2 sm:justify-end">
            <Button type="button" variant="secondary" onClick={() => setMode("choose")}>
              Back
            </Button>
            <Button type="submit">Save & continue</Button>
          </div>
        </form>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-text tracking-tight">
          Seed your fleet
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Add at least one motorcycle, import a list, or skip for now.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => setMode("add")}
          className="rounded-[12px] border border-border bg-surface p-4 text-left shadow-[var(--shadow-soft)] hover:border-primary hover:bg-primary-soft/40 transition-colors"
        >
          <div className="rounded-[10px] bg-primary-soft p-2 text-primary w-fit">
            <Bike className="size-5" />
          </div>
          <p className="mt-3 text-sm font-semibold text-text">Add motorcycle</p>
          <p className="mt-1 text-xs text-text-secondary">
            Enter plate and fleet details manually
          </p>
        </button>

        <button
          type="button"
          onClick={goNext}
          className="rounded-[12px] border border-border bg-surface p-4 text-left shadow-[var(--shadow-soft)] hover:border-primary hover:bg-primary-soft/40 transition-colors"
        >
          <div className="rounded-[10px] bg-surface-muted p-2 text-text-secondary w-fit">
            <FileUp className="size-5" />
          </div>
          <p className="mt-3 text-sm font-semibold text-text">Import</p>
          <p className="mt-1 text-xs text-text-secondary">
            Upload a CSV of plates (demo skips file pick)
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
            Set up fleet later from the admin console
          </p>
        </button>
      </div>

      <div className="flex justify-start pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/onboarding/operations")}
        >
          Back
        </Button>
      </div>
    </div>
  );
}
