"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { isOperator } from "@/lib/auth/roles";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OperatorPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (!isOperator(user)) {
        router.push("/");
      }
    }
  }, [user, loading, router]);

  if (loading || !user || !isOperator(user)) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <MonoLabel>LOADING...</MonoLabel>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <MonoLabel>OPERATOR CONSOLE</MonoLabel>
        <h1 className="text-2xl font-fraunces text-milyfe-text">
          Operator Dashboard
        </h1>
        <p className="text-milyfe-text-muted">
          Full operator console will be built in a future prompt.
        </p>
      </div>
    </main>
  );
}
