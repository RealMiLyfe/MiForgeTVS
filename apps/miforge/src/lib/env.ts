type EnvKey =
  | "NEXT_PUBLIC_SITE_URL"
  | "OPERATOR_EMAIL"
  | "NEXT_PUBLIC_SUPABASE_URL"
  | "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  | "SUPABASE_SERVICE_ROLE_KEY"
  | "ANTHROPIC_API_KEY"
  | "OPENAI_API_KEY"
  | "NVIDIA_API_KEY"
  | "NVIDIA_BASE_URL"
  | "GROQ_API_KEY"
  | "PADDLE_API_KEY"
  | "PADDLE_WEBHOOK_SECRET"
  | "NEXT_PUBLIC_PADDLE_CLIENT_TOKEN"
  | "GOCARDLESS_ACCESS_TOKEN"
  | "GOCARDLESS_WEBHOOK_SECRET"
  | "RESEND_API_KEY"
  | "CAL_COM_API_KEY"
  | "DOCUSEAL_API_KEY"
  | "DOCUSEAL_URL"
  | "POSTHOG_API_KEY";

export function getEnv(key: EnvKey): string {
  const value = process.env[key] ?? "";
  return value;
}

export function isPlaceholder(key: EnvKey): boolean {
  const value = getEnv(key);
  return !value || value === "PLACEHOLDER" || value.trim() === "";
}

export function requireEnv(key: EnvKey): string {
  const value = getEnv(key);
  if (isPlaceholder(key)) {
    console.warn(
      `[ENV WARNING] ${key} is a placeholder. Using mock/stub data.`
    );
    return "PLACEHOLDER";
  }
  return value;
}

export function isPlaceholderMode(service: "supabase" | "ai" | "payments" | "email" | "analytics"): boolean {
  switch (service) {
    case "supabase":
      return isPlaceholder("NEXT_PUBLIC_SUPABASE_URL") || isPlaceholder("NEXT_PUBLIC_SUPABASE_ANON_KEY");
    case "ai":
      return (
        isPlaceholder("ANTHROPIC_API_KEY") &&
        isPlaceholder("OPENAI_API_KEY") &&
        isPlaceholder("NVIDIA_API_KEY") &&
        isPlaceholder("GROQ_API_KEY")
      );
    case "payments":
      return isPlaceholder("PADDLE_API_KEY") && isPlaceholder("GOCARDLESS_ACCESS_TOKEN");
    case "email":
      return isPlaceholder("RESEND_API_KEY");
    case "analytics":
      return isPlaceholder("POSTHOG_API_KEY");
  }
}
