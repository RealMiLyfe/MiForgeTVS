"use client";

import { ConciergeHero } from "@/components/home/ConciergeHero";
import { LiveAssemblyCinematic } from "@/components/home/LiveAssemblyCinematic";
import { SocialProofBand } from "@/components/home/SocialProofBand";
import { ProductsShowcase } from "@/components/home/ProductsShowcase";
import { ManifestoExcerpt } from "@/components/home/ManifestoExcerpt";
import { ClosingCTA } from "@/components/home/ClosingCTA";
import { Footer } from "@/components/home/Footer";

export default function Home() {
  return (
    <>
      <ConciergeHero />
      <LiveAssemblyCinematic />
      <SocialProofBand />
      <ProductsShowcase />
      <ManifestoExcerpt />
      <ClosingCTA />
      <Footer />
    </>
  );
}
