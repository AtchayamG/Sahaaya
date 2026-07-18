import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

const config = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  { ignores: [".next/**", "coverage/**", "node_modules/**"] },
  { files: ["next-env.d.ts"], rules: { "@typescript-eslint/triple-slash-reference": "off" } },
  { files: ["scripts/browser-audit.js"], rules: { "@typescript-eslint/no-unused-expressions": "off" } },
];

export default config;
