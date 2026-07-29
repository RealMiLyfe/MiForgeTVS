"use client";

import { useState } from "react";
import { HeroSection } from "@/components/miforge/HeroSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { Hammer, Calendar, Mail } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", businessName: "", reason: "general", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSent(true);
  };

  return (
    <>
      <HeroSection headline="Let's talk about your factory." subhead="Every conversation starts with understanding your operation. Reach out however works best." />
      {/* Contact Methods */}
      <section className="w-full bg-milyfe-surface py-16">
        <div className="mx-auto max-w-5xl px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-milyfe-border bg-milyfe-bg p-6 text-center">
            <Hammer className="h-6 w-6 text-milyfe-cyan mx-auto mb-3" />
            <h3 className="font-medium text-milyfe-text mb-2">Commission a Forge</h3>
            <p className="text-sm text-milyfe-text-muted mb-4">Ready to have a factory built?</p>
            <Link href="/miforge/bespoke"><Button variant="ghost" size="sm">Start a Bespoke Forge →</Button></Link>
          </div>
          <div className="rounded-xl border border-milyfe-border bg-milyfe-bg p-6 text-center">
            <Calendar className="h-6 w-6 text-milyfe-teal mx-auto mb-3" />
            <h3 className="font-medium text-milyfe-text mb-2">Book a Scoping Call</h3>
            <p className="text-sm text-milyfe-text-muted mb-4">Talk it through with an operator.</p>
            <Button variant="ghost" size="sm" disabled>Book a Call →</Button>
          </div>
          <div className="rounded-xl border border-milyfe-border bg-milyfe-bg p-6 text-center">
            <Mail className="h-6 w-6 text-milyfe-emerald mx-auto mb-3" />
            <h3 className="font-medium text-milyfe-text mb-2">Email Directly</h3>
            <p className="text-sm text-milyfe-text-muted mb-4">Questions, partnerships, or inquiries.</p>
            <a href="mailto:miforge@milyfe.fun"><Button variant="ghost" size="sm">miforge@milyfe.fun</Button></a>
          </div>
        </div>
      </section>
      {/* Contact Form */}
      <section className="w-full bg-milyfe-bg py-16">
        <div className="mx-auto max-w-xl px-6">
          {sent ? (
            <div className="text-center space-y-4">
              <h2 className="font-fraunces text-2xl text-milyfe-emerald">Message sent.</h2>
              <p className="text-milyfe-text-muted">We&apos;ll respond within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input placeholder="Your name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              <Input type="email" placeholder="Your email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              <Input placeholder="Business name (optional)" value={form.businessName} onChange={e => setForm({...form, businessName: e.target.value})} />
              <select value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} className="w-full h-10 rounded-lg border border-milyfe-border bg-milyfe-surface px-3 text-sm text-milyfe-text">
                <option value="general">General inquiry</option>
                <option value="partnership">Partnership</option>
                <option value="broker">Broker/referral</option>
                <option value="media">Media/press</option>
                <option value="support">Support</option>
                <option value="other">Other</option>
              </select>
              <Textarea placeholder="Your message" value={form.message} onChange={e => setForm({...form, message: e.target.value})} required className="min-h-[120px]" />
              <Button type="submit" variant="gradient" className="w-full">Send Message</Button>
            </form>
          )}
        </div>
      </section>
      <div className="w-full bg-milyfe-surface py-8 text-center">
        <MonoLabel>RESPONSE TIME</MonoLabel>
        <p className="text-sm text-milyfe-text-muted mt-2">All messages responded to within 24 hours, Monday-Friday.</p>
      </div>
    </>
  );
}
