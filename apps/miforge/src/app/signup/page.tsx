"use client";

import { MiLyfeLockup } from "@/components/shared/MiLyfeLockup";
import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { SignupForm } from "@/components/auth/SignupForm";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";
import Link from "next/link";

export default function SignupPage() {
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
            <GradientHeadline size="card">Claim your factory.</GradientHeadline>
            <p className="text-sm text-milyfe-text-muted">
              Create your account to get started.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-milyfe-border bg-milyfe-surface p-6">
          <SignupForm />
        </div>

        <div className="text-center">
          <p className="text-sm text-milyfe-text-muted">
            Already have an account?{" "}
            <Link href="/login" className="text-milyfe-cyan hover:underline">
              Sign in.
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
