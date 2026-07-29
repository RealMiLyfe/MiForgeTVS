"use client";

import { useState, useEffect } from "react";
import { MiLyfeLockup } from "@/components/shared/MiLyfeLockup";
import { AuthAvatar } from "@/components/shared/AuthAvatar";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/shared/StatusPill";
import { Search, Menu, X } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { label: "Factories", href: "/factories" },
  { label: "Pricing", href: "/miforge/pricing" },
  { label: "Manifesto", href: "/manifesto" },
];

const products = [
  { name: "MiForge", desc: "SaaS Factory", href: "/miforge", status: "active" as const },
  { name: "MiVault", desc: "Financial Ops", href: "#", status: "paused" as const },
  { name: "MiSignal", desc: "Intelligence Layer", href: "#", status: "paused" as const },
  { name: "MiReach", desc: "Outbound Growth", href: "#", status: "paused" as const },
];

export function GlobalNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b ${scrolled ? "h-14 bg-milyfe-bg/95 backdrop-blur-md border-milyfe-border" : "h-16 bg-milyfe-bg/80 backdrop-blur-sm border-transparent"}`}>
        <div className="mx-auto max-w-7xl h-full px-6 flex items-center justify-between">
          {/* Left */}
          <MiLyfeLockup size="sm" />
          {/* Center - desktop */}
          <div className="hidden md:flex items-center gap-6">
            <div className="relative" onMouseEnter={() => setProductsOpen(true)} onMouseLeave={() => setProductsOpen(false)}>
              <button className="text-sm text-milyfe-text-muted hover:text-milyfe-text transition-colors">Products</button>
              {productsOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 rounded-xl border border-milyfe-border bg-milyfe-surface p-2 shadow-lg">
                  {products.map(p => (
                    <Link key={p.name} href={p.href} className="flex items-center justify-between p-3 rounded-lg hover:bg-milyfe-surface-2 transition-colors">
                      <div><div className="text-sm font-medium text-milyfe-text">{p.name}</div><div className="text-xs text-milyfe-text-muted">{p.desc}</div></div>
                      <StatusPill variant={p.status}>{p.status === "active" ? "LIVE" : "SOON"}</StatusPill>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {navLinks.map(l => <Link key={l.href} href={l.href} className="text-sm text-milyfe-text-muted hover:text-milyfe-text transition-colors">{l.label}</Link>)}
          </div>
          {/* Right */}
          <div className="flex items-center gap-3">
            <button className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg text-milyfe-text-muted hover:text-milyfe-text hover:bg-milyfe-surface-2 transition-colors" aria-label="Search">
              <Search className="h-4 w-4" />
            </button>
            <div className="hidden sm:block"><AuthAvatar /></div>
            <Link href="/miforge/bespoke" className="hidden lg:block"><Button variant="gradient" size="sm">Commission a Forge</Button></Link>
            <button className="md:hidden h-8 w-8 flex items-center justify-center" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
          </div>
        </div>
      </nav>
      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-milyfe-surface border-l border-milyfe-border p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <MiLyfeLockup size="sm" />
              <button onClick={() => setMobileOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              {[{ label: "MiForge", href: "/miforge" }, ...navLinks, { label: "Contact", href: "/contact" }].map(l => (
                <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="block text-lg text-milyfe-text hover:text-milyfe-cyan transition-colors">{l.label}</Link>
              ))}
              <div className="pt-4 border-t border-milyfe-border">
                <Link href="/miforge/bespoke" onClick={() => setMobileOpen(false)}><Button variant="gradient" className="w-full">Commission a Forge</Button></Link>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
