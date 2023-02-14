/** @type {import("eslint").Linter.Config} */
const config = {
  extends: "next/core-web-vitals",
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json"],
  },
};

module.exports = config;
