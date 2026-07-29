import { MonoLabel } from "@/components/shared/MonoLabel";

export default function VerifyEmailPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-milyfe-bg">
      <div className="text-center space-y-4">
        <MonoLabel>EMAIL VERIFICATION</MonoLabel>
        <h1 className="text-2xl font-fraunces text-milyfe-text">
          Check your inbox.
        </h1>
        <p className="text-milyfe-text-muted">
          We sent a verification link to your email address.
        </p>
      </div>
    </main>
  );
}
