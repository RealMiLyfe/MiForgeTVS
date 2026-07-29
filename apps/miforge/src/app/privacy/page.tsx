import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" subtitle="How MiLyfe handles your data." lastUpdated="JANUARY 2025">
      <h2>1. Introduction</h2>
      <p>This Privacy Policy describes how MiLyfe (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;) collects, uses, and protects your personal information when you use our platform at milyfe.fun and all associated services.</p>
      <h2>2. Data We Collect</h2>
      <h3>Account Data</h3><p>Name, email address, avatar, and authentication credentials.</p>
      <h3>Business Context Data</h3><p>Business name, niche, revenue metrics, customer counts, platform integrations, brand voice samples — used to personalize your Factory.</p>
      <h3>Payment Data</h3><p>Processed exclusively by Paddle and GoCardless. We do not store card numbers or bank details.</p>
      <h3>Usage Data</h3><p>Chat sessions with agents, page views, engagement metrics, and feature usage patterns.</p>
      <h2>3. How We Use Your Data</h2>
      <ul><li>Providing and operating the Platform</li><li>Forging and operating your Factory agents</li><li>Communicating service updates and reports</li><li>Improving MiLyfe products and services</li><li>Detecting and preventing fraud or abuse</li></ul>
      <h2>4. Third-Party Processors</h2>
      <ul><li><strong>Supabase</strong> — Database and authentication</li><li><strong>Vercel</strong> — Platform hosting</li><li><strong>Anthropic, OpenAI, NVIDIA, Groq</strong> — AI inference providers</li><li><strong>Paddle, GoCardless</strong> — Payment processing</li><li><strong>Cal.com</strong> — Scheduling</li><li><strong>Resend</strong> — Transactional email</li><li><strong>PostHog</strong> — Product analytics</li></ul>
      <h2>5. Data Retention</h2>
      <p>Account data retained while account is active. Chat session data retained for 90 days after last interaction. Business context data deleted within 30 days of account closure upon request.</p>
      <h2>6. Your Rights</h2>
      <p>You have the right to: access your data, correct inaccuracies, request deletion, export your data (portability), object to processing, and restrict processing. Exercise these rights by emailing miforge@milyfe.fun.</p>
      <h2>7. Data Security</h2>
      <p>We implement encryption in transit (TLS 1.3) and at rest. Access to production data is limited to authorized personnel. Regular security audits are conducted.</p>
      <h2>8. International Data Transfers</h2>
      <p>Data may be processed in the US and EU. We ensure adequate protections via Standard Contractual Clauses where applicable.</p>
      <h2>9. Cookies and Tracking</h2>
      <p>We use essential cookies for authentication and session management. Analytics cookies (PostHog) are used with your consent. You can disable non-essential cookies in your browser settings.</p>
      <h2>10. Children&apos;s Privacy</h2>
      <p>The Platform is not intended for users under 18. We do not knowingly collect data from children.</p>
      <h2>11. Changes to This Policy</h2>
      <p>We may update this policy periodically. Material changes will be communicated via email 30 days before taking effect.</p>
      <h2>12. Contact Information</h2>
      <p>Data protection inquiries: <a href="mailto:miforge@milyfe.fun">miforge@milyfe.fun</a></p>
    </LegalPageLayout>
  );
}
