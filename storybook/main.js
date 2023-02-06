const path = require('path');

/* eslint-disable no-unused-vars */
const replaceFileExtension = (filePath, newExtension) => {
    const { name, root, dir } = path.parse(filePath);
    return path.format({
        name,
        root,
        dir,
        ext: newExtension,
    });
};

module.exports = {
    stories: [
        '../src/**/*.stories.mdx',
        '../src/**/*.stories.@(js|jsx|ts|tsx)',
        '../src/**/stories/*.stories.mdx',
    ],
    staticDirs: ['./public'],
    addons: [
        '@storybook/addon-links',
        {
            name: '@storybook/addon-essentials',
            options: {
                docs: false,
            },
        },
        '@storybook/addon-interactions',
        '@storybook/preset-scss',
        '@storybook/addon-a11y',
        {
            name: '@storybook/addon-docs',
            options: {
                configureJSX: true,
            },
        },
    ],
    framework: '@storybook/react',
    core: {
        builder: '@storybook/builder-webpack5',
    },
    features: {
        interactionsDebugger: true,
    },
    webpackFinal: async (config) => {
        const aliases = {
            Services: path.resolve(__dirname, '../src/services'),
            Hooks: path.resolve(__dirname, '../src/hooks'),
            Utilities: path.resolve(__dirname, '../src/utilities'),
            Domains: path.resolve(__dirname, '../src/domains'),
            Errors: path.resolve(__dirname, '../src/errors'),
            Helpers: path.resolve(__dirname, '../src/helpers'),
            Stores: path.resolve(__dirname, '../src/stores'),
            'Components/Modal/Modal': path.resolve(
                __dirname,
                '../story-helpers/__mocks__/Modal'
            ),
            'Components/AdSlot/AdSlot': path.resolve(
                __dirname,
                '../story-helpers/__mocks__/AdSlotMock'
            ),
            Components: path.resolve(__dirname, '../src/components'),
        };

        const newConfig = { ...config };

        Object.keys(aliases).forEach((alias) => {
            newConfig.resolve.alias[alias] = aliases[alias];
        });

        return newConfig;
    },
};
