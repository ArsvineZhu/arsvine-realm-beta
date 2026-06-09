const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// 远程图床白名单集中在 config/image-hosts.js 维护，新增/删除域名只改那一处
const remotePatterns = require('./config/image-hosts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_BUILD_DIR || '.next',
  reactStrictMode: true,
  images: {
    remotePatterns,
  },
};

module.exports = withBundleAnalyzer(nextConfig);
