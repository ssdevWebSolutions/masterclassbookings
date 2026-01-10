/** @type {import('next').NextConfig} */
const path = require('path');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const nextConfig = {
  reactStrictMode: true,

  eslint: {
    ignoreDuringBuilds: true,
  },

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
