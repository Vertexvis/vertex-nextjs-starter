import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import simpleImportSort from "eslint-plugin-simple-import-sort";

const config = [
  ...nextVitals,
  ...nextTypescript,
  prettier,
  {
    plugins: { "simple-import-sort": simpleImportSort },
    rules: {
      "no-await-in-loop": "warn",
      "no-return-await": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "require-await": "warn",
      "simple-import-sort/imports": "warn",
    },
  },
];

export default config;
