import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/operator/", "/api/", "/auth/", "/factory/*/unlock/"],
      },
    ],
    sitemap: "https://milyfe.fun/sitemap.xml",
  };
}
