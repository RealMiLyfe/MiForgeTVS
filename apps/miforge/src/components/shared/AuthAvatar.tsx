"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { isOperator } from "@/lib/auth/roles";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { LogOut, LayoutDashboard, Settings, Shield } from "lucide-react";

export function AuthAvatar() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!user) {
    return (
      <Link href="/login">
        <Button variant="ghost" size="sm">Sign in</Button>
      </Link>
    );
  }

  const initials = (user.full_name || user.email)
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-milyfe-surface-2 border border-milyfe-border text-xs font-medium text-milyfe-text hover:border-milyfe-cyan transition-colors"
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 w-48 rounded-lg border border-milyfe-border bg-milyfe-surface p-1 shadow-lg">
          <p className="px-3 py-2 text-xs text-milyfe-text-muted truncate">
            {user.email}
          </p>
          <div className="h-px bg-milyfe-border my-1" />
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-milyfe-surface-2"
            onClick={() => setOpen(false)}
          >
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Link>
          {isOperator(user) && (
            <Link
              href="/operator"
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-milyfe-surface-2"
              onClick={() => setOpen(false)}
            >
              <Shield className="h-4 w-4" /> Operator Console
            </Link>
          )}
          <Link
            href="/settings"
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-milyfe-surface-2"
            onClick={() => setOpen(false)}
          >
            <Settings className="h-4 w-4" /> Settings
          </Link>
          <div className="h-px bg-milyfe-border my-1" />
          <button
            onClick={() => { signOut(); setOpen(false); }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-milyfe-surface-2 text-red-400"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}
