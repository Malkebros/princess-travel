import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cursor port-forward opens the app as http://127.0.0.1:<port>, while
  // `next dev` treats localhost as the origin — without this, /_next assets hang.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default nextConfig;
