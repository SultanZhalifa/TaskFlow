import js from '@eslint/js';
import globals from 'globals';

export default [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: globals.browser,
        },
        rules: {
            'no-console': ['warn', { allow: ['error'] }],
            'no-unused-vars': 'warn',
            eqeqeq: 'error',
            'no-var': 'error',
            'prefer-const': 'warn',
        },
    },
];
