import Document, { Html, Head, Main, NextScript } from 'next/document';
import NewRelicBrowserAgent from 'components/NewRelicBrowserAgent/NewRelicBrowserAgent';

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <NewRelicBrowserAgent />
                    <link
                        rel="icon"
                        type="image/png"
                        sizes="32x32"
                        href="/favicons/favicon-32x32.png"
                    />
                    <link
                        rel="icon"
                        type="image/png"
                        sizes="16x16"
                        href="/favicons/favicon-16x16.png"
                    />
                    <link
                        rel="apple-touch-icon"
                        sizes="180x180"
                        href="/favicons/apple-touch-icon.png"
                    />
                    <meta
                        name="description"
                        content="Find new ideas and classic advice on strategy, innovation and leadership, for global leaders from the world's best business and management experts."
                    />
                    <meta
                        name="item-id"
                        content="73a647bc281441917e8f0879b0bd0fc5"
                    />
                    <meta name="ox-group" content="537064956" />
                    <meta name="page-id" content="200" />
                    <meta name="page-type" content="LANDING" />
                    <meta
                        property="og:title"
                        content="Harvard Business Review - Page"
                    />
                    <script
                        async
                        src="//securepubads.g.doubleclick.net/tag/js/gpt.js"
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
