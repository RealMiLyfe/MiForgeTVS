"use client";

import { MiLyfeLockup } from "@/components/shared/MiLyfeLockup";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { AuthAvatar } from "@/components/shared/AuthAvatar";
import { LayoutDashboard, Bot, FileText, Settings, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Agents", href: "/dashboard/agents", icon: Bot },
  { label: "Reports", href: "/dashboard/reports", icon: FileText },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-milyfe-bg">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-[240px] border-r border-milyfe-border p-4">
        <div className="mb-6">
          <MiLyfeLockup size="sm" />
        </div>
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${active ? "bg-milyfe-surface-2 text-milyfe-text" : "text-milyfe-text-muted hover:text-milyfe-text hover:bg-milyfe-surface"}`}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <div className="h-px bg-milyfe-border my-4" />
          <Link href="/miforge/catalog" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-milyfe-text-muted hover:text-milyfe-cyan transition-colors">
            <Plus className="h-4 w-4" /> Add an Agent
          </Link>
        </nav>
        <div className="pt-4 border-t border-milyfe-border">
          <AuthAvatar />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-milyfe-border">
          <MiLyfeLockup size="sm" />
          <AuthAvatar />
        </div>
        {/* Mobile nav */}
        <div className="md:hidden flex overflow-x-auto border-b border-milyfe-border px-4 gap-4">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-1.5 py-3 text-xs whitespace-nowrap border-b-2 ${active ? "border-milyfe-emerald text-milyfe-text" : "border-transparent text-milyfe-text-muted"}`}>
                <item.icon className="h-3.5 w-3.5" />{item.label}
              </Link>
            );
          })}
        </div>
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
