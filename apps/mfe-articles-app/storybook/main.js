const path = require('path');

const config = {
    stories: [
        '../src/**/*.mdx',
        '../src/**/*.stories.@(js|jsx|mjs)',
        '../../../packages/*/src/**/*.stories.@(js|jsx)',
    ],
    staticDirs: ['../public'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
        '@storybook/addon-a11y',
    ],
    framework: {
        name: '@storybook/nextjs',
        options: {},
    },
    docs: {
        autodocs: true,
        defaultName: 'Overview',
    },
    webpackFinal: async (webpackConfig) => {
        const aliases = {
            'mfe-core/ui/AdSlot': '../story-helpers/__mocks__/AdSlotMock',
            components: '../src/components',
            layouts: '../src/layouts',
            scss: '../src/scss',
            stores: '../src/stores',
            helpers: '../src/helpers',
            __mocks__: '../src/__mocks__',
        };
        const newConfig = {
            ...webpackConfig,
        };
        Object.keys(aliases).forEach((alias) => {
            newConfig.resolve.alias[alias] = path.resolve(
                __dirname,
                aliases[alias],
            );
        });
        return newConfig;
    },
};
export default config;
