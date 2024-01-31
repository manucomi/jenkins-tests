module.exports = {
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.{js,jsx}'],
    coveragePathIgnorePatterns: [
        '.*.stories.(js|jsx)',
        '<rootDir>/src/.*/.*/stories/*',
    ],
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
        '^Build-Helpers/(.*)': '<rootDir>/build-helpers/$1',
        '^Components/(.*)': '<rootDir>/src/components/$1',
        '^Helpers/(.*)': '<rootDir>/src/helpers/$1',
        /**
         * uuid < v9.x is not compatible with ESM in jest. @aws-sdk is
         * pulling in uuid v8.x. Until this is upgraded, the following
         * workaround is needed.
         *
         * https://github.com/uuidjs/uuid/issues/451
         */
        '^uuid$': require.resolve('uuid'),
    },
    modulePathIgnorePatterns: ['<rootDir>/dist'],
    testEnvironment: 'jsdom',
    testMatch: ['**/src/**/*.test.js?(x)'],
};
