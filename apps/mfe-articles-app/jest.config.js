const nextJest = require('next/jest');

const createJestConfig = nextJest({
    dir: './',
});

const customJestConfig = {
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.{js,jsx}'],
    coveragePathIgnorePatterns: ['pages/', '.*.stories.(js|jsx)'],
    coverageReporters: ['lcov', 'text', 'html'],
    coverageDirectory: '.coverage',
    coverageThreshold: {
        global: {
            branches: 90,
            functions: 90,
            lines: 90,
            statements: 90,
        },
    },
    moduleNameMapper: {
        '\\.(s)?css$': 'identity-obj-proxy',
        '^components/(.*)$': '<rootDir>/src/components/$1',
        '^scss/(.*)$': '<rootDir>/src/scss/$1',
        '^layouts/(.*)$': '<rootDir>/src/layouts/$1',
        '^stores/(.*)$': '<rootDir>/src/stores/$1',
        '^helpers/(.*)$': '<rootDir>/src/helpers/$1',
    },

    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
module.exports = createJestConfig(customJestConfig);
