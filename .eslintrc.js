module.exports = {
  extends: "tune",
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  plugins: [
    "flowtype",
    "import",
    "react",
  ],
  rules: {
    "comma-dangle": ["error", {
      arrays: "always-multiline",
      objects: "always-multiline",
      imports: "always-multiline",
      exports: "always-multiline",
      functions: "never"
    }],
    "no-duplicate-imports": "off"
  },
  settings: {
    "import/resolver": {
      webpack: {
        config: './webpack.config.js'
      }
    }
  }
};
