module.exports = {
  // Disable minifying with SWC until
  // https://github.com/vercel/next.js/discussions/30237#discussioncomment-2950246
  // is resolved.
  swcMinify: false,
  webpack: (config) => {
    config.output.assetModuleFilename = `static/[hash][ext]`;
    config.output.publicPath = `/_next/`;
    config.module.rules.push({
      test: /\.worker.js/,
      type: `asset/resource`,
    });
    return config;
  },
};
