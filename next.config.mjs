/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/pacstac-verification-demo",
  assetPrefix: "/pacstac-verification-demo/",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve = config.resolve ?? {};
    config.resolve.fallback = {
      ...(config.resolve.fallback ?? {}),
      "pino-pretty": false,
    };
    return config;
  },
};

export default nextConfig;
