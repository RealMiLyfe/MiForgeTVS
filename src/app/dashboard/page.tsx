"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <MonoLabel>LOADING...</MonoLabel>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <MonoLabel>CLIENT DASHBOARD</MonoLabel>
        <h1 className="text-2xl font-fraunces text-milyfe-text">
          Welcome, {user.full_name}
        </h1>
        <p className="text-milyfe-text-muted">
          Your factory dashboard will be built in a future prompt.
        </p>
      </div>
    </main>
  );
}
