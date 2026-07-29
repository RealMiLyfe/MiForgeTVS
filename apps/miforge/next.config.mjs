/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations
  reactStrictMode: true,
  poweredByHeader: false,

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "milyfe.fun" },
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      { source: "/home", destination: "/", permanent: true },
      { source: "/agents", destination: "/miforge/catalog", permanent: true },
      { source: "/pricing", destination: "/miforge/pricing", permanent: true },
    ];
  },
};

export default nextConfig;
