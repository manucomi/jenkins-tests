module.exports = {
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.{js,jsx}'],
    coveragePathIgnorePatterns: ['.*.stories.(js|jsx)'],
    coverageReporters: ['lcov', 'text', 'html', 'json'],
    coverageDirectory: '.tmp/coverage',
    coverageThreshold: {
        global: {
            branches: 90,
            functions: 90,
            lines: 90,
            statements: 90,
        },
    },
    moduleNameMapper: {
        '.(css|scss)$': 'identity-obj-proxy',
        '\\.png$': '<rootDir>/src/__mocks__/imageImportMock.js',
        '^Components/(.*)': '<rootDir>/src/components/$1',
        '^Services/(.*)': '<rootDir>/src/services/$1',
        '^Hooks/(.*)': '<rootDir>/src/hooks/$1',
        '^Utilities/(.*)': '<rootDir>/src/utilities/$1',
        '^Domains/(.*)': '<rootDir>/src/domains/$1',
        '^Errors/(.*)': '<rootDir>/src/errors/$1',
        '^Helpers/(.*)': '<rootDir>/src/helpers/$1',
        '^Stores/(.*)': '<rootDir>/src/stores/$1',
    },
    testEnvironment: 'jsdom',
    testMatch: ['**/src/**/*.test.js?(x)'],
};
