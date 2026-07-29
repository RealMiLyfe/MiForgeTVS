import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { MonoLabel } from "@/components/shared/MonoLabel";
import Link from "next/link";

interface LegalPageLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalPageLayout({ title, subtitle, lastUpdated, children }: LegalPageLayoutProps) {
  return (
    <main className="min-h-screen bg-milyfe-bg py-20">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-12 text-center">
          <GradientHeadline size="section">{title}</GradientHeadline>
          <p className="mt-2 text-milyfe-text-muted">{subtitle}</p>
          <MonoLabel className="mt-4 block">LAST UPDATED: {lastUpdated}</MonoLabel>
        </div>
        <div className="prose prose-invert max-w-none [&_h2]:font-fraunces [&_h2]:text-xl [&_h2]:text-milyfe-text [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-milyfe-text [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:text-milyfe-text-muted [&_p]:leading-relaxed [&_li]:text-milyfe-text-muted [&_ul]:space-y-1 [&_a]:text-milyfe-cyan">
          {children}
        </div>
        <div className="mt-16 pt-8 border-t border-milyfe-border text-center">
          <Link href="/" className="text-sm text-milyfe-cyan hover:underline">Return to MiLyfe</Link>
          <p className="mt-2 font-mono text-xs text-milyfe-text-muted">miforge@milyfe.fun</p>
        </div>
      </div>
    </main>
  );
}
