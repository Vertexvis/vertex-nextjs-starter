const path = require("path");

module.exports = {
  webpack: (config) => {
    config.output.assetModuleFilename = `static/[hash][ext]`;
    config.output.publicPath = `/_next/`;
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
      "react/jsx-runtime": path.resolve(
        __dirname,
        "node_modules/react/jsx-runtime"
      ),
      "react/jsx-dev-runtime": path.resolve(
        __dirname,
        "node_modules/react/jsx-dev-runtime"
      ),
    };
    config.module.rules.push({
      test: /\.worker.js/,
      type: `asset/resource`,
    });
    return config;
  },
};
