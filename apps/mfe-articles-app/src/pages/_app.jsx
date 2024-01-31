import PropTypes from 'prop-types';
import 'scss/manifest.scss';
import useConfig from 'mfe-core/hooks/useConfig';
import Head from 'next/head';
import GPTLoader from 'mfe-core/ui/GPTLoader';
import { primaryAdUnitId } from 'components/PrimaryAd/PrimaryAd';
import useArticleStore from 'stores/article/article.store';

const adUnits = [
    {
        path: '/34363400/HBR_970x250',
        id: primaryAdUnitId,
        adSizes: [
            [300, 250],
            [600, 500],
            [970, 250],
            [728, 90],
            [1940, 500],
        ],
        adTargets: {
            position: '1',
            inventory: 'ATF',
        },
    },
];

function App({ Component, pageProps }) {
    const { setApiOrigin } = useConfig();
    setApiOrigin(process.env.NEXT_PUBLIC_API_ORIGIN);
    const setArticle = useArticleStore((state) => state.setArticle);
    setArticle(pageProps.article);
    return (
        <>
            <Head>
                <GPTLoader adUnits={adUnits} />
            </Head>
            {
                // eslint-disable-next-line react/jsx-props-no-spreading
                <Component {...pageProps} />
            }
        </>
    );
}

App.propTypes = {
    Component: PropTypes.element.isRequired,
    pageProps: PropTypes.shape({
        article: PropTypes.instanceOf(Object).isRequired,
    }).isRequired,
};

export default App;
