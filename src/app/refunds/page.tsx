import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export default function RefundsPage() {
  return (
    <LegalPageLayout title="Refund Policy" subtitle="When and how refunds work." lastUpdated="JANUARY 2025">
      <h2>1. Refund Window</h2>
      <p>The Forge Fee is refundable within 7 days of activation, before agent deployment goes live. Once agents are deployed and operating, the Forge Fee is non-refundable.</p>
      <h2>2. Retainer Cancellation</h2>
      <p>Cancel anytime after your tier&apos;s minimum commitment:</p>
      <ul><li><strong>Specimen:</strong> Month 2 minimum</li><li><strong>Standard:</strong> Month 3 minimum</li><li><strong>Sovereign:</strong> Month 6 minimum</li></ul>
      <p>Prorated refunds for partial months may be issued at operator discretion.</p>
      <h2>3. Uplift Share Obligations</h2>
      <p>Uplift Share obligations continue for 12 months post-cancellation on measurable outcomes attributable to MiForge&apos;s work during the active period.</p>
      <h2>4. Non-Refundable Items</h2>
      <ul><li>Compute costs already incurred</li><li>Third-party service costs (Cal.com, Paddle fees, integration costs)</li><li>Bespoke agent development work already delivered</li></ul>
      <h2>5. How to Request a Refund</h2>
      <p>Email <a href="mailto:miforge@milyfe.fun">miforge@milyfe.fun</a> with your factory number and reason for refund request. We respond within 2 business days. Approved refunds processed within 10 business days.</p>
      <h2>6. Chargebacks</h2>
      <p>Please contact us before initiating a chargeback with your bank. We resolve disputes faster directly. Chargebacks initiated without prior contact may result in account suspension pending resolution.</p>
      <h2>7. Contact</h2>
      <p>All refund inquiries: <a href="mailto:miforge@milyfe.fun">miforge@milyfe.fun</a></p>
    </LegalPageLayout>
  );
}
