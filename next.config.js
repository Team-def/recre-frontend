/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/:path*/",
        //destination: `https://api.choiwheatley.store/:path*/`,
        destination: process.env.NEXT_PUBLIC_SOCKET_API + "/:path*/",
      },
    ];
  },
  trailingSlash: true,
  reactStrictMode: false,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
