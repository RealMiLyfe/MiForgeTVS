"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers/AuthProvider";

export function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const getPasswordStrength = (pw: string) => {
    if (pw.length < 6) return { label: "Weak", color: "bg-red-500", width: "w-1/4" };
    if (pw.length < 8) return { label: "Fair", color: "bg-yellow-500", width: "w-1/2" };
    if (pw.length < 12) return { label: "Good", color: "bg-milyfe-cyan", width: "w-3/4" };
    return { label: "Strong", color: "bg-milyfe-emerald", width: "w-full" };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      setError("Please accept the terms of service");
      return;
    }
    setError("");
    setLoading(true);
    const { success, error: err } = await signUp(email, password, name);
    if (success) {
      router.push("/dashboard");
    } else {
      setError(err || "Sign up failed");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <div className="space-y-2">
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        {password && (
          <div className="space-y-1">
            <div className="h-1 bg-milyfe-surface-2 rounded-full overflow-hidden">
              <div className={`h-full ${strength.color} ${strength.width} transition-all`} />
            </div>
            <p className="text-xs text-milyfe-text-muted">{strength.label}</p>
          </div>
        )}
      </div>
      <label className="flex items-start gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          className="mt-1 rounded border-milyfe-border"
        />
        <span className="text-milyfe-text-muted">
          I agree to the{" "}
          <a href="/terms" className="text-milyfe-cyan hover:underline">Terms of Service</a>
          {" "}and{" "}
          <a href="/privacy" className="text-milyfe-cyan hover:underline">Privacy Policy</a>
        </span>
      </label>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <Button type="submit" variant="gradient" className="w-full" disabled={loading}>
        {loading ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
