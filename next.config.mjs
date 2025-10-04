/** @type {import('next').NextConfig} */
const nextConfig = {
     images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jrcfxdvkhzlwwazynyae.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
