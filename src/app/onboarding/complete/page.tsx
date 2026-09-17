"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppDispatch } from "@/store";
import { login, setRole } from "@/store/slices/auth-slice";
import { CheckCircle2, LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OnboardingCompletePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  function goDashboard() {
    dispatch(login());
    dispatch(setRole("COMPANY_ADMIN"));
    router.push("/admin");
  }

  return (
    <Card className="shadow-[var(--shadow-soft)] text-center" padding="lg">
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-[14px] bg-success-soft text-success">
        <CheckCircle2 className="size-7" />
      </div>
      <h1 className="text-xl sm:text-2xl font-semibold text-text tracking-tight">
        Workspace ready
      </h1>
      <p className="mt-2 text-sm text-text-secondary max-w-md mx-auto">
        Virunga Transport is set up for dispatch, fleet tracking, and trip
        approvals. You can refine settings anytime from the admin console.
      </p>

      <ul className="mt-6 mx-auto max-w-sm text-left space-y-2 text-sm text-text-secondary">
        <li className="flex gap-2">
          <CheckCircle2 className="size-4 text-success shrink-0 mt-0.5" />
          Company profile configured
        </li>
        <li className="flex gap-2">
          <CheckCircle2 className="size-4 text-success shrink-0 mt-0.5" />
          Operations defaults saved
        </li>
        <li className="flex gap-2">
          <CheckCircle2 className="size-4 text-success shrink-0 mt-0.5" />
          Ready for live requests and GPS
        </li>
      </ul>

      <div className="mt-8 flex justify-center">
        <Button
          size="lg"
          onClick={goDashboard}
          leftIcon={<LayoutDashboard className="size-4" />}
        >
          Go to Dashboard
        </Button>
      </div>
    </Card>
  );
}
