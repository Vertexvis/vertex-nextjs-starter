// import path from "node:path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

/* if developing vertexvis/viewer or web-sdk packages locally, and using linked packages via yarn the below configuration may be useful
 * otherwise, you can remove this section and use the default next.config.ts
 *
const nextConfig: NextConfig = {
  bundlePagesRouterDependencies: true,
  // transpilePackages: ["@vertexvis/viewer", "@vertexvis/viewer-react"],
  turbopack: {
    // Linked workspace packages live outside this app directory.
    // Turbopack needs its root raised to resolve those symlink targets.
    root: path.join(process.cwd(), ".."),
    // Module resolution aliases for monorepo/portal setup
    // Ensures consistent react/react-dom resolution across packages
    resolveAlias: {
      react: "./node_modules/react",
      "react-dom": "./node_modules/react-dom",
      "react/jsx-runtime": "./node_modules/react/jsx-runtime",
      "react/jsx-dev-runtime": "./node_modules/react/jsx-dev-runtime",
    },
    // Custom rules for non-standard file types
    rules: {
      "*.worker.js": {
        type: "asset",
      },
    },
  },

  // Webpack config only needed for features not yet supported by Turbopack
  // Most webpack customization has been moved to turbopack config above
  webpack: (config) => {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      react: path.join(process.cwd(), "node_modules/react"),
      "react-dom": path.join(process.cwd(), "node_modules/react-dom"),
      "react/jsx-runtime": path.join(process.cwd(), "node_modules/react/jsx-runtime"),
      "react/jsx-dev-runtime": path.join(
        process.cwd(),
        "node_modules/react/jsx-dev-runtime"
      ),
    };
    return config;
  },
};
*/

export default nextConfig;
