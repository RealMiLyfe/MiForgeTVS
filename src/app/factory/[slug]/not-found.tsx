import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FactoryNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-milyfe-bg px-6 text-center">
      <MonoLabel className="mb-6">FACTORY NOT FOUND</MonoLabel>
      <GradientHeadline size="section">This factory hasn&apos;t been forged yet.</GradientHeadline>
      <p className="mt-4 text-milyfe-text-muted">The factory you&apos;re looking for doesn&apos;t exist or has been archived.</p>
      <div className="mt-8 flex gap-4">
        <Link href="/factories"><Button variant="gradient">Browse Factories</Button></Link>
        <Link href="/miforge/bespoke"><Button variant="ghost">Commission a Forge</Button></Link>
      </div>
    </main>
  );
}
