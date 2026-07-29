import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-milyfe-bg px-6 text-center">
      <MonoLabel className="mb-6">ERROR 404</MonoLabel>
      <GradientHeadline size="hero">This factory doesn&apos;t exist.</GradientHeadline>
      <p className="mt-4 max-w-md text-milyfe-text-muted">
        Or it was archived. Or it hasn&apos;t been forged yet. Or you took a wrong turn.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
        <Link href="/"><Button variant="gradient" size="lg">Return to MiLyfe →</Button></Link>
        <Link href="/factory/derek-adams"><Button variant="ghost" size="lg">See a Live Factory →</Button></Link>
      </div>
      <p className="mt-12 text-xs text-milyfe-text-muted">If you believe this is an error, email miforge@milyfe.fun</p>
    </main>
  );
}
