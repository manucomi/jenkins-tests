import alias from '@rollup/plugin-alias';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import path from 'path';
import postcss from 'rollup-plugin-postcss';
import postcssPresetEnv from 'postcss-preset-env';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import url from '@rollup/plugin-url';
import pkg from './package.json';
import getFontFiles from './build-helpers/getFontFiles';
import getFilesFromDir from './build-helpers/getFilesFromDir';

const outputPath = 'dist';
const fontOutputPath = `${outputPath}/typography`;

const configs = [
    // package all javascript components and hooks
    {
        input: {
            ...getFilesFromDir('src/components', 'ui'),
            ...getFilesFromDir('src/hooks', 'hooks'),
            ...getFilesFromDir('src/utilities', 'utils'),
        },
        output: [
            {
                dir: outputPath,
                format: 'cjs',
                exports: 'auto',
            },
        ],
        plugins: [
            resolve({
                extensions: ['.js', '.jsx'],
            }),
            commonjs(),
            babel({
                babelHelpers: 'runtime',
                exclude: '**/node_modules/**',
                extensions: ['.js', '.jsx'],
            }),
            postcss({
                extract: 'css/styles.css',
                plugins: [postcssPresetEnv()],
            }),
            url(),
            terser(),
            alias({
                entries: {
                    Components: path.resolve(__dirname, 'src/components'),
                    Services: path.resolve(__dirname, 'src/services'),
                    Hooks: path.resolve(__dirname, 'src/hooks'),
                    Utilities: path.resolve(__dirname, 'src/utilities'),
                    Domains: path.resolve(__dirname, 'src/domains'),
                    Errors: path.resolve(__dirname, 'src/errors'),
                    Helpers: path.resolve(__dirname, 'src/helpers'),
                    Stores: path.resolve(__dirname, 'src/stores'),
                },
            }),
        ],
        external: Object.keys(pkg.peerDependencies || {}),
    },
];

// package all fonts
getFontFiles().forEach((filePath) => {
    const fileName = filePath.split('/').pop().split('.')[0];

    configs.push({
        input: filePath,
        output: {
            file: `${fontOutputPath}/${fileName}.css`,
        },
        plugins: [
            postcss({
                extract: true,
                plugins: [postcssPresetEnv()],
            }),
            copy({
                targets: [
                    {
                        src: `src/scss/fonts/${fileName}/fonts/*`,
                        dest: `${fontOutputPath}/fonts`,
                    },
                ],
            }),
        ],
    });
});

export default configs;
