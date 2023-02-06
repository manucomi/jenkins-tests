module.exports = {
    moduleNameMapper: {
        '.(css|scss)$': 'identity-obj-proxy',
        '\\.png$': '<rootDir>/src/__mocks__/imageImportMock.js',
    },
    testEnvironment: 'jsdom',
    testMatch: ['**/storybook.visual.test.js'],
};
