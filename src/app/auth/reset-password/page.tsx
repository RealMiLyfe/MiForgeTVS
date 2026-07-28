"use client";

import { MiLyfeLockup } from "@/components/shared/MiLyfeLockup";
import { GradientHeadline } from "@/components/shared/GradientHeadline";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";

export default function ResetPasswordPage() {
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
            <GradientHeadline size="card">Reset password.</GradientHeadline>
            <p className="text-sm text-milyfe-text-muted">
              Enter your email to receive a reset link.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-milyfe-border bg-milyfe-surface p-6">
          <ResetPasswordForm />
        </div>
      </motion.div>
    </main>
  );
}
