import { isPlaceholderMode } from "@/lib/env";

export async function sendEmail(options: {
  to: string | string[];
  templateSlug: string;
  variables: Record<string, string>;
  from?: string;
  subject?: string;
}) {
  const { to, templateSlug, variables, from = "MiForge <miforge@milyfe.fun>" } = options;

  if (isPlaceholderMode("email")) {
    const subject = interpolate(options.subject || `[${templateSlug}]`, variables);
    console.log(`[Email Placeholder Mode]`);
    console.log(`  To: ${Array.isArray(to) ? to.join(", ") : to}`);
    console.log(`  From: ${from}`);
    console.log(`  Template: ${templateSlug}`);
    console.log(`  Subject: ${subject}`);
    console.log(`  Variables: ${JSON.stringify(variables)}`);
    return { success: true, messageId: `mock_${Date.now()}` };
  }

  // Production: use Resend
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    const subject = interpolate(options.subject || templateSlug, variables);

    const result = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html: `<p>${interpolate("Email content for template: " + templateSlug, variables)}</p>`,
    });

    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error("[Email Error]", error);
    return { success: false, error };
  }
}

function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] || `{{${key}}}`);
}
