module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'react-app',
    'react-app/jest',
    'plugin:prettier/recommended', // Убедитесь, что это здесь для интеграции с Prettier
    'eslint:recommended', // Базовые рекомендации ESLint
    'plugin:react/recommended', // Рекомендации для React
    'plugin:react-hooks/recommended', // Рекомендации для React Hooks
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12, // Или 2021, если хотите быть более явным
    sourceType: 'module',
  },
  plugins: [
    'react',
    'react-hooks',
    'prettier', // Должен быть здесь для интеграции с Prettier
  ],
  rules: {
    // Здесь вы можете добавить свои кастомные правила
    'react/react-in-jsx-scope': 'off', // Отключает требование импорта React в JSX (не нужно с React 17+)
    'react/prop-types': 'off', // Отключает требование PropTypes (если используете TypeScript или другую валидацию)
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto', // Помогает избежать проблем с CRLF/LF на разных ОС
      },
    ],
  },
  settings: {
    react: {
      version: 'detect', // Автоматически определяет версию React
    },
  },
};
