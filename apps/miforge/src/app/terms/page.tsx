import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Service" subtitle="The agreement between you and MiLyfe." lastUpdated="JANUARY 2025">
      <p className="text-xs italic border border-milyfe-border rounded-lg p-4 bg-milyfe-surface">This document should be reviewed by qualified legal counsel before public deployment.</p>
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing or using the MiLyfe platform (milyfe.fun), including all products housed within it (collectively &quot;the Platform&quot;), you agree to be bound by these Terms of Service. If you do not agree, do not use the Platform.</p>
      <h2>2. Service Description</h2>
      <p>MiLyfe is a house of autonomous infrastructure products. MiForge, the first product, is a SaaS Factory service that forges, deploys, and operates AI agents within client business operations (&quot;Factories&quot;).</p>
      <h2>3. Account Registration</h2>
      <p>You are responsible for maintaining the security of your account credentials. You must provide accurate information during registration. One account per person or entity.</p>
      <h2>4. Factory Commissioning</h2>
      <p>Commissioning a Factory involves a scoping process, agent development, deployment, and ongoing operation. Timelines are estimates. Actual delivery depends on complexity and your responsiveness during the scoping phase.</p>
      <h2>5. Payment Terms</h2>
      <p>Payments are processed through Paddle (credit/debit cards) and GoCardless (direct bank debit). The pricing structure consists of three components: a one-time Forge Fee, a monthly Operating Retainer, and a performance-based Uplift Share.</p>
      <h2>6. Uplift Share Calculation</h2>
      <p>Uplift Share is calculated on measurable outcomes directly attributable to Factory agent activity. Categories include: revenue recovery, sale price uplift, cost savings, and customer reactivation. Measurement methodology is agreed upon during scoping.</p>
      <h2>7. Cancellation Policy</h2>
      <p>Retainer cancellation is available after your tier&apos;s minimum commitment period: Specimen (1 month), Standard (3 months), Sovereign (6 months). 30 days written notice required.</p>
      <h2>8. Intellectual Property</h2>
      <p>You retain full ownership of all outputs produced by your Factory agents. MiForge retains ownership of the platform, methodology, agent architectures, and underlying technology.</p>
      <h2>9. Confidentiality</h2>
      <p>We treat all business data, integration credentials, and operational information as confidential. We do not share client data between Factories or with third parties except as necessary for service delivery.</p>
      <h2>10. Liability Limitations</h2>
      <p>MiLyfe&apos;s total liability shall not exceed the total fees paid by you in the 12 months preceding any claim. We are not liable for indirect, incidental, or consequential damages.</p>
      <h2>11. Warranties and Disclaimers</h2>
      <p>The Platform is provided &quot;as is.&quot; We do not guarantee specific business outcomes. Agent performance depends on data quality, business context, and market conditions.</p>
      <h2>12. Indemnification</h2>
      <p>You agree to indemnify MiLyfe against claims arising from your use of the Platform, your Factory&apos;s outputs, or your violation of these Terms.</p>
      <h2>13. Termination</h2>
      <p>Either party may terminate with 30 days written notice after minimum commitments. MiLyfe may suspend service immediately for payment default or Terms violations.</p>
      <h2>14. Governing Law</h2>
      <p>These Terms are governed by the laws of England and Wales. Disputes shall be resolved through binding arbitration.</p>
      <h2>15. Dispute Resolution</h2>
      <p>Before initiating formal proceedings, parties agree to a 30-day good-faith resolution period starting from written notice of dispute.</p>
      <h2>16. Changes to Terms</h2>
      <p>We may update these Terms with 30 days notice. Continued use after notice constitutes acceptance. Material changes will be communicated via email.</p>
      <h2>17. Contact Information</h2>
      <p>For questions about these Terms: <a href="mailto:miforge@milyfe.fun">miforge@milyfe.fun</a></p>
    </LegalPageLayout>
  );
}
