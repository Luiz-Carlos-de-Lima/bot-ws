module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    // Outras configurações específicas do projeto
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    // Regras personalizadas
    'no-console': 'warn',
    'indent': ['error', 2],
    // Adicione mais regras conforme necessário
  },
};
