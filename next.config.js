/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: process.env.A32_BUILD_DIR || '.next',
};

module.exports = nextConfig;
