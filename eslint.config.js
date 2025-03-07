import pluginJs from "@eslint/js";
import eslintParser from "@typescript-eslint/parser";
import configPrettier from "eslint-config-prettier";
import pluginImport from "eslint-plugin-import";
import pluginJest from "eslint-plugin-jest";
import pluginJsdoc from "eslint-plugin-jsdoc";
import pluginPrettier from "eslint-plugin-prettier";
import pluginSecurity from "eslint-plugin-security";
import globals from "globals";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["src/**/*.{mjs,cjs,ts}"],
    languageOptions: {
      parser: eslintParser
    }
  },
  {
    languageOptions: {
      globals: globals.node
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginSecurity.configs.recommended,
  {
    plugins: {
      prettier: pluginPrettier,
      jsdoc: pluginJsdoc,
      security: pluginSecurity,
      jest: pluginJest,
      import: pluginImport
    },
    rules: {
      // Base rules
      ...configPrettier.rules,

      // JsDoc configs
      "jsdoc/require-description": "error",
      "jsdoc/check-values": "error",

      // Include Prettier
      "prettier/prettier": "error",

      // Jest rules
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",

      // Import rules
      "import/order": [
        "error",
        {
          groups: [["builtin"], ["external"], ["internal"], ["parent", "sibling", "index"]],
          pathGroups: [
            {
              pattern: "node:*",
              group: "builtin",
              position: "before"
            }
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true
          }
        }
      ],
      "import/no-duplicates": "error",

      // General rules
      "prefer-const": ["error"],
      quotes: ["error", "double"],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "security/detect-object-injection": "off",

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_"
        }
      ],
      "no-unused-vars": "off",

      // Other rules
      "no-unused-expressions": "error",
      "no-undef": "error"
    }
  }
];
