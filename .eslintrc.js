module.exports = {
  root: true,
  overrides: [
    {
      files: ["**/*.ts?(x)"],
      extends: [
       // "next/core-web-vitals",
        "plugin:@next/next/recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
      ],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.json",
      },
      plugins: ["@typescript-eslint"],
    },
  ],
};
