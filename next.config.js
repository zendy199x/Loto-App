const path = require("path");

module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [],
  },
  output: "standalone",
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    config.resolve.fallback = { fs: false };

    return config;
  },
};
