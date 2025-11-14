/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
  },
  images: {
    domains: [],
  },
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/why-engage",
        destination: "/the-road-ahead",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;

