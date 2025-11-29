/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/pacstac-verification-demo",
  assetPrefix: "/pacstac-verification-demo/",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
