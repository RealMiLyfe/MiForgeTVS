"use client";

import { MiLyfeLockup } from "@/components/shared/MiLyfeLockup";
import { AuthAvatar } from "@/components/shared/AuthAvatar";
import { Button } from "@/components/ui/button";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { LayoutDashboard, Factory, Compass, FileText, Users, DollarSign, Bell, BookOpen, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Overview", href: "/operator", icon: LayoutDashboard },
  { label: "Factories", href: "/operator/factories", icon: Factory },
  { label: "Concierge", href: "/operator/concierge", icon: Compass },
  { label: "Bespoke", href: "/operator/bespoke", icon: FileText },
  { label: "Waitlist", href: "/operator/waitlist", icon: Users },
  { label: "Prospects", href: "/operator/prospects", icon: Bell },
  { label: "Revenue", href: "/operator/revenue", icon: DollarSign },
  { label: "Catalog", href: "/operator/catalog", icon: BookOpen },
  { label: "Settings", href: "/operator/settings", icon: Settings },
];

export default function OperatorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-milyfe-bg">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-[240px] border-r border-milyfe-border shrink-0">
        <div className="p-4 border-b border-milyfe-border">
          <MiLyfeLockup size="sm" format="milyfe-miforge" />
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const active = pathname === item.href || (item.href !== "/operator" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${active ? "bg-milyfe-surface-2 text-milyfe-text border-l-2 border-milyfe-emerald" : "text-milyfe-text-muted hover:text-milyfe-text hover:bg-milyfe-surface"}`}>
                <item.icon className="h-4 w-4" />{item.label}
              </Link>
            );
          })}
          <div className="h-px bg-milyfe-border my-3" />
          <Link href="/operator/factories" className="block">
            <Button variant="gradient" size="sm" className="w-full text-xs">+ Forge New Factory</Button>
          </Link>
        </nav>
        <div className="p-4 border-t border-milyfe-border">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-full bg-milyfe-surface-2 rounded-full overflow-hidden">
              <div className="h-full w-[40%] bg-milyfe-gradient rounded-full" />
            </div>
          </div>
          <MonoLabel className="text-[9px]">CAPACITY: 2/5 SLOTS USED</MonoLabel>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b border-milyfe-border flex items-center justify-between px-6 bg-milyfe-bg/90 backdrop-blur-md shrink-0">
          <div className="md:hidden"><MiLyfeLockup size="sm" /></div>
          <div className="hidden md:block" />
          <div className="flex items-center gap-3">
            <Button variant="gradient" size="sm" className="hidden sm:flex text-xs">+ Forge New Factory</Button>
            <AuthAvatar />
          </div>
        </header>
        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
