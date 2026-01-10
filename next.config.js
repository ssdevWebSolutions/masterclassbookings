/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  turbopack: {},  // Enables Turbopack explicitly, resolves webpack conflict

  webpack(config, { isServer }) {
    config.plugins.push(new CaseSensitivePathsPlugin());
    
    // Explicitly configure resolve aliases for better compatibility
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    
    return config;
  },
};

module.exports = nextConfig;
