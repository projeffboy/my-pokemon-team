import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";

export default tseslint.config(
  {
    ignores: [
      "build",
      ".vercel/output",
      "src/data",
      "src/app/RAMP.ts",
      "playwright-*report",
      "*-results",
    ],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { ignoreRestSiblings: true },
      ],
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: { globals: globals.browser },
    plugins: { "react-hooks": reactHooks },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXAttribute[name.name='style']",
          message: "Use the sx prop.",
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [{ regex: "^\\.\\./\\.\\./", message: "Use the @ alias." }],
        },
      ],
    },
  },
  {
    files: ["scripts/**", "*.config.{js,ts}", "tests/**"],
    languageOptions: { globals: globals.node },
    // Playwright fixtures must destructure their first argument, even when empty
    rules: { "no-empty-pattern": "off" },
  },
);
