module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    "ecmaVersion": 2020,
    "sourceType": "module",
    "allowImportExportEverywhere": true
  },
  env: { "node": true },
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    "array-bracket-spacing": ["error", "always"],
    "block-scoped-var": "error",
    "brace-style": "error",
    "camelcase": "error",
    "comma-dangle": ["error", "always-multiline"],
    "computed-property-spacing": ["error", "never"],
    curly: "error",
    "eol-last": "error",
    eqeqeq: ["error", "smart"],
    indent: [
      error,
      2,
      {
        SwitchCase: 1
      }
    ],
    "keyword-spacing": ["error", { "before": true, "after": true }],
    "max-depth": ["error", 5],
    "max-len": ["error", 120],
    "max-statements": ["error", 30],
    "new-cap": "off",
    "no-caller": "error",
    "no-debugger": "error",
    "no-else-return": "error",
    "no-extend-native": "error",
    "no-mixed-spaces-and-tabs": "error",
    "no-trailing-spaces": "error",
    "no-redeclare": "error",
    "no-undef": "error",
    "no-unused-vars": ["error", { "argsIgnorePattern": "next" }],
    "no-use-before-define": ["error", "nofunc"],
    "object-curly-spacing": ["error", "always"],
    "object-shorthand": ["error", "always"],
    "prefer-arrow-callback": "error",
    "prefer-const": "error",
    quotes: ["error", "single", "avoid-escape"],
    semi: ["error", "always"],
    "space-before-blocks": "error",
    "space-before-function-paren": [
      error,
      {
        anonymous: "ignore",
        named: "never"
      }
    ],
    "space-unary-ops": ["error", { "words": true, "nonwords": false }],
    "spaced-comment": "error"
  }
};