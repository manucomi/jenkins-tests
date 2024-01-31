const resourceCacheControl = 'public, max-age=31536000, immutable';
const documentPermissionPolicy =
    'accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), camera=(), cross-origin-isolated=(), display-capture=(), document-domain=(), encrypted-media=(), execution-while-not-rendered=(), execution-while-out-of-viewport=(), fullscreen=(), geolocation=(), gyroscope=(), keyboard-map=(), magnetometer=(), microphone=(), midi=(), navigation-override=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), usb=(), web-share=(), xr-spatial-tracking=()';
const assetBasePath = '/assets-mfe-articles';

module.exports = () => {
    return {
        assetPrefix: assetBasePath,
        productionBrowserSourceMaps: true,
        async rewrites() {
            return {
                beforeFiles: [
                    {
                        source: `${assetBasePath}/_next/:path*`,
                        destination: '/_next/:path*',
                    },
                ],
            };
        },
        async headers() {
            return [
                {
                    source: '/(fonts|images|favicons)/(.*)',
                    headers: [
                        {
                            key: 'cache-control',
                            value: resourceCacheControl,
                        },
                    ],
                },
                {
                    source: '/',
                    headers: [
                        {
                            key: 'strict-transport-security',
                            value: 'max-age=7776000',
                        },
                        {
                            key: 'x-content-type-options',
                            value: 'nosniff',
                        },
                        {
                            key: 'referrer-policy',
                            value: 'strict-origin-when-cross-origin',
                        },
                        {
                            key: 'pragma',
                            value: 'no-cache',
                        },
                        {
                            key: 'permission-policy',
                            value: documentPermissionPolicy,
                        },
                        {
                            key: 'x-frame-options',
                            value: 'SAMEORIGIN',
                        },
                    ],
                },
            ];
        },
        // Compression happens at our CDN, not on our server.
        compress: false,
        eslint: {
            /**
             * We run eslint as a pre-commit hook and again in our CI workflow.
             * Running it a 3rd time during the build step just wastes time.
             */
            ignoreDuringBuilds: true,
        },
        transpilePackages: ['mfe-articles-renderer'],
        poweredByHeader: false,
        reactStrictMode: true,
        typescript: {
            // We don't use TypeScript, so this is safe to ignore.
            ignoreBuildErrors: true,
        },
    };
};
