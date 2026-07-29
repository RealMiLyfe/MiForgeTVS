import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ManifestoPage() {
  return (
    <main className="min-h-screen bg-milyfe-bg py-20 md:py-32">
      <article className="mx-auto max-w-[720px] px-6">
        <div className="text-center mb-16">
          <MonoLabel>THE MILYFE MANIFESTO</MonoLabel>
          <GradientHeadline size="hero" as="h1" className="mt-6">The businesses that come next.</GradientHeadline>
          <p className="mt-4 text-sm text-milyfe-text-muted italic">Written by the founders of MiLyfe · 2025</p>
        </div>

        <div className="space-y-10 text-milyfe-text-muted leading-relaxed">
          <section>
            <h2 className="font-fraunces text-xl text-milyfe-text mb-4">The Old Model</h2>
            <p>For decades, building a business meant one thing above all else: hiring people. Payroll was the engine. You needed customer service? Hire three people. You needed marketing? Hire two more. Sales? Another four. Every function, every operation, every repeatable task required a human sitting in a chair doing it manually, day after day.</p>
            <p className="mt-4">This model created incredible things. It built industries. It gave millions meaningful work. But it also created a cage for operators. You couldn&apos;t scale without hiring. You couldn&apos;t hire without managing. You couldn&apos;t manage without sacrificing the creative, strategic work that made the business worth building in the first place.</p>
            <p className="mt-4">Every owner-operator eventually hits the same wall: the business they built to serve their life starts demanding they serve it instead.</p>
          </section>

          <section>
            <h2 className="font-fraunces text-xl text-milyfe-text mb-4">What Broke</h2>
            <p>Something shifted. Not gradually — suddenly. AI stopped being a novelty and became genuinely capable of doing work. Not party tricks. Not chatbots that respond with canned phrases. Actual autonomous work: writing emails that convert, responding to customers with nuance, analyzing data and generating reports, creating content that matches a brand voice, monitoring operations and flagging anomalies.</p>
            <p className="mt-4">The realization wasn&apos;t subtle: a massive portion of operational labor — the part that made payroll so expensive, that made hiring so necessary, that made scaling so painful — is repeatable. It&apos;s patternable. And now, it&apos;s forgeable.</p>
          </section>

          <section>
            <h2 className="font-fraunces text-xl text-milyfe-text mb-4">The Distinction</h2>
            <p>We need to be precise about what we&apos;re saying. This isn&apos;t &quot;AI replacing jobs.&quot; That framing is lazy and it&apos;s wrong.</p>
            <p className="mt-4">What&apos;s actually happening: <em className="text-milyfe-text">AI is replacing the repetitive layer of business operations so humans can do what only humans can do.</em> Creative direction. Strategic judgment. Relationship depth. High-context decisions. The work that made you start the business in the first place.</p>
            <p className="mt-4">The factory doesn&apos;t replace the operator. It frees them.</p>
          </section>

          <section>
            <h2 className="font-fraunces text-xl text-milyfe-text mb-4">Why &quot;Forged&quot;</h2>
            <p>We chose this word deliberately. Not &quot;built&quot; — too generic, too kit-like. Not &quot;generated&quot; — implies temporary, disposable. <em className="text-milyfe-text">Forged</em> — shaped with heat and intention, meant to last, meant to be used hard.</p>
            <p className="mt-4">A factory isn&apos;t assembled from a template. It&apos;s forged. Every agent is shaped to the specific business it serves. Every configuration reflects the specific operational reality of one operator. Nothing is generic. Nothing is one-size-fits-all.</p>
          </section>

          <section>
            <h2 className="font-fraunces text-xl text-milyfe-text mb-4">What MiLyfe Is</h2>
            <p>MiLyfe is a house of products. Each product serves a different layer of the autonomous business. MiForge is the first — the factory itself. Others follow. Financial operations. Intelligence layers. Growth systems. Each one forged with the same philosophy: bespoke, autonomous, built to last.</p>
          </section>

          <section>
            <h2 className="font-fraunces text-xl text-milyfe-text mb-4">Who This Is For</h2>
            <p>Operators tired of the compromises. Founders who built something meaningful and got trapped inside it. Agencies hitting the wall of hourly billing. Creators drowning in the ops side of their creative work. People who want their business to serve their life — not the reverse.</p>
            <p className="mt-4">If you&apos;ve ever looked at your to-do list and thought &quot;ninety percent of this shouldn&apos;t require me&quot; — you&apos;re who we built this for.</p>
          </section>

          <section>
            <h2 className="font-fraunces text-xl text-milyfe-text mb-4">The Bar We&apos;re Building To</h2>
            <p>Every factory forged must feel bespoke. Every agent must belong to the business it serves. Every deployment must free the operator from work only they used to be able to do. Nothing shipped without craft. Nothing deployed without care.</p>
          </section>

          <section>
            <h2 className="font-fraunces text-xl text-milyfe-text mb-4">The Future We&apos;re Forging Toward</h2>
            <p>Businesses that run on autonomous infrastructure, staffed by agents that never sleep, overseen by humans who reclaim their time. Operators who scale without hiring. Companies built on infrastructure instead of headcount.</p>
            <p className="mt-4">That&apos;s what the businesses that come next look like.</p>
          </section>
        </div>

        <div className="mt-20 text-center">
          <p className="font-fraunces text-2xl text-milyfe-gradient italic">&quot;You didn&apos;t stumble here. You were looking for this.&quot;</p>
          <div className="mt-8">
            <Link href="/miforge/bespoke"><Button variant="gradient" size="lg">Commission Your Factory →</Button></Link>
          </div>
        </div>
      </article>
    </main>
  );
}
