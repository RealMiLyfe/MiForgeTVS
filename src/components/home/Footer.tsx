import { MiLyfeLockup } from "@/components/shared/MiLyfeLockup";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const productLinks = [
  { label: "MiForge", href: "/miforge", active: true },
  { label: "MiVault", href: "#", active: false },
  { label: "MiSignal", href: "#", active: false },
  { label: "MiReach", href: "#", active: false },
];

const platformLinks = [
  { label: "Factories", href: "/factories" },
  { label: "Pricing", href: "/miforge/pricing" },
  { label: "Manifesto", href: "/manifesto" },
  { label: "Contact", href: "/contact" },
];

const legalLinks = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Refund Policy", href: "/refunds" },
];

export function Footer() {
  return (
    <footer className="w-full bg-milyfe-bg border-t border-milyfe-border">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="space-y-3">
            <MiLyfeLockup size="sm" />
            <p className="text-sm text-milyfe-text-muted">
              House of autonomous infrastructure.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-medium text-sm text-milyfe-text mb-3">Products</h4>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.label}>
                  {link.active ? (
                    <Link
                      href={link.href}
                      className="text-sm text-milyfe-text-muted hover:text-milyfe-text transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <span className="text-sm text-milyfe-text-muted/50">
                      {link.label} <span className="text-xs">(Coming Soon)</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-medium text-sm text-milyfe-text mb-3">Platform</h4>
            <ul className="space-y-2">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-milyfe-text-muted hover:text-milyfe-text transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-medium text-sm text-milyfe-text mb-3">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-milyfe-text-muted hover:text-milyfe-text transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <MonoLabel>© MILYFE · miforge@milyfe.fun</MonoLabel>
          <MonoLabel>Q4 2025 · FORGE CAPACITY LIMITED</MonoLabel>
        </div>
      </div>
    </footer>
  );
}
