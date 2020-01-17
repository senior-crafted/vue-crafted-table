module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module',
    parser: 'babel-eslint',
  },
  env: {
    jest: true,
    browser: true,
  },
  extends: [
    'plugin:vue/recommended',
    'airbnb-base',
  ],
  // required to lint *.vue files
  plugins: [
    'vue',
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
  },
  settings: {
    'import/resolver':
      'webpack',
  },
};
