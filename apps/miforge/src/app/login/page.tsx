"use client";

import { MiLyfeLockup } from "@/components/shared/MiLyfeLockup";
import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { MagicLinkForm } from "@/components/auth/MagicLinkForm";
import { PasswordForm } from "@/components/auth/PasswordForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-milyfe-bg px-4">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md space-y-8"
      >
        <div className="flex flex-col items-center space-y-6">
          <MiLyfeLockup size="md" />
          <div className="text-center space-y-2">
            <GradientHeadline size="card">Welcome back.</GradientHeadline>
            <p className="text-sm text-milyfe-text-muted">
              Sign in to access your factory.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-milyfe-border bg-milyfe-surface p-6">
          <Tabs defaultValue="magic-link" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="magic-link">Magic Link</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="magic-link">
              <MagicLinkForm />
            </TabsContent>
            <TabsContent value="password">
              <PasswordForm />
            </TabsContent>
          </Tabs>
        </div>

        <div className="text-center">
          <p className="text-sm text-milyfe-text-muted">
            New to MiLyfe?{" "}
            <Link href="/miforge/bespoke" className="text-milyfe-cyan hover:underline">
              Commission a factory.
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
