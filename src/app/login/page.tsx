"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/input";
import { useAppDispatch } from "@/store";
import { login, setRole } from "@/store/slices/auth-slice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("admin@virunga.rw");
  const [password, setPassword] = useState("••••••••");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    dispatch(login());
    dispatch(setRole("COMPANY_ADMIN"));
    router.push("/admin");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-[400px]">
        <p className="text-center text-xs font-semibold tracking-[0.14em] uppercase text-text-muted mb-6">
          FleetOps
        </p>

        <Card className="shadow-[var(--shadow-soft)]" padding="lg">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-text tracking-tight">
              Sign in
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Virunga Transport workspace
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Email">
              <Input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.rw"
                required
              />
            </Field>
            <Field label="Password">
              <Input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Field>

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" fullWidth size="lg">
              Login
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-text-secondary">
            New to FleetOps?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Create workspace
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
