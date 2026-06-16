import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import eslintSimpleSort from "eslint-plugin-simple-import-sort";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";
import tsEslint from "typescript-eslint";

export default defineConfig(
  {
    extends: [
      js.configs.recommended,
      ...tsEslint.configs.recommended,
      ...pluginVue.configs["flat/recommended"],
    ],
  },
  {
    ignores: [
      "dist/**",
      "docker/**",
      "coverage/**",
      "npm-debug.log*",
      "yarn-debug.log*",
      "yarn-error.log*",
    ],
  },
  eslintConfigPrettier,
  {
    files: ["src/**/*.{js,ts,vue}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        parser: tsEslint.parser,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        global: "readonly",
      },
    },
    plugins: {
      "simple-import-sort": eslintSimpleSort,
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^\\u0000"], // side-effect imports
            ["^node:"],
            ["^@?\\w"],
            [
              "^@/",
              "^app/",
              "^pages/",
              "^widgets/",
              "^features/",
              "^entities/",
              "^shared/",
            ],
            ["^\\./", "^\\.\\./"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
      "prefer-const": "error",
    },
  }
);
