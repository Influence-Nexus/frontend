module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['react-app', 'react-app/jest', 'plugin:prettier/recommended'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
  },
  overrides: [
    {
      files: ['**/*.test.{js,jsx}'],
      env: {
        jest: true,
      },
    },
  ],
};
