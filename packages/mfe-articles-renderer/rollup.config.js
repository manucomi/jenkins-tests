import alias from '@rollup/plugin-alias';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import path from 'path';
import postcss from 'rollup-plugin-postcss';
import postcssPresetEnv from 'postcss-preset-env';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import url from '@rollup/plugin-url';
import pxtorem from 'postcss-pxtorem';
import pkg from './package.json';
import getFilesFromDir from './build-helpers/getFilesFromDir';

const outputPath = 'dist';

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
            alias({
                entries: [
                    {
                        find: 'Build-Helpers',
                        replacement: path.resolve(__dirname, 'build-helpers'),
                    },
                    {
                        find: 'Components',
                        replacement: path.resolve(__dirname, 'src/components'),
                    },
                    {
                        find: 'Utilities',
                        replacement: path.resolve(__dirname, 'src/utilities'),
                    },
                ],
            }),
            resolve({
                extensions: ['.js', '.jsx'],
            }),
            commonjs(),
            json({
                compact: true,
            }),
            babel({
                babelHelpers: 'runtime',
                exclude: '**/node_modules/**',
                extensions: ['.js', '.jsx'],
            }),
            postcss({
                extract: 'css/styles.css',
                plugins: [
                    postcssPresetEnv(),
                    pxtorem({
                        rootValue: 16,
                        unitPrecision: 5,
                        mediaQuery: true,
                        propList: [
                            'font',
                            'font-size',
                            'line-height',
                            'letter-spacing',
                        ],
                    }),
                ],
            }),
            url(),
            terser(),
        ],
        external: Object.keys(pkg.peerDependencies || {}),
    },
];

export default configs;
