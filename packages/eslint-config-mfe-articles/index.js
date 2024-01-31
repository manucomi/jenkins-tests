module.exports = {
    env: {
        browser: true,
        es6: true,
        jest: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:jsx-a11y/recommended',
        'airbnb',
        'airbnb/hooks',
        'next',
        'plugin:prettier/recommended',
        'plugin:storybook/recommended',
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: ['jest-dom', 'testing-library', 'jsx-a11y', 'prettier', 'react'],
    settings: {
        react: {
            version: 'detect',
        },
        next: {
            rootDir: ['apps/*/'],
        },
        'import/resolver': {
            node: {
                paths: ['src'],
            },
        },
    },
    ignorePatterns: ['.*.js', '**/.*.json', '**/node_modules/', '**/dist/'],
    rules: {
        '@next/next/no-img-element': [0],
        'react/prop-types': [2],
        'react/require-default-props': [
            2,
            {
                functions: 'defaultProps',
            },
        ],
    },
};
