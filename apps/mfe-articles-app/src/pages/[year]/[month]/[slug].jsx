import Head from 'next/head';
import { useRouter } from 'next/router';
import InterstitialModal from 'mfe-core/ui/InterstitialModal';
import { MockArticle } from 'mfe-articles-shared';
import PropTypes from 'prop-types';
import Footer from 'mfe-core/ui/Footer';
import LayoutResolver from 'components/LayoutResolver/LayoutResolver';
import PartnerCenter from 'mfe-core/ui/PartnerCenter';

function Article({ article }) {
    // Example of how to access the dynamic paths client side. Remove it eventually.
    const { query } = useRouter();
    console.log(query.year, query.month, query.slug);

    return (
        <>
            <Head>
                <title>{article.title}</title>
                <link
                    rel="preload"
                    as="image"
                    href={article.hero.image.defaultSrc}
                    imageSrcSet={article.hero.image.srcset}
                    imageSizes={article.hero.image.sizes}
                />
            </Head>
            <InterstitialModal />
            <LayoutResolver />
            <PartnerCenter />
            <Footer />
        </>
    );
}

Article.propTypes = {
    article: PropTypes.shape({
        title: PropTypes.string.isRequired,
        hero: PropTypes.shape({
            image: PropTypes.shape({
                defaultSrc: PropTypes.string,
                srcset: PropTypes.string,
                sizes: PropTypes.string,
            }),
        }),
    }).isRequired,
};

const getArticleByTypeString = (slug) => {
    return (
        MockArticle.find(
            (article) =>
                article.type.replace(/\s+/g, '-').toLowerCase() ===
                slug.toLowerCase(),
        ) || MockArticle[0]
    );
};

const getServerSideProps = async ({ query }) => {
    // Example of how to access the dynamic paths server side. Remove it eventually.
    console.log(query.year, query.month, query.slug);
    const targetArticle = getArticleByTypeString(query.slug);

    return {
        props: { article: targetArticle },
    };
};

export default Article;
export { getServerSideProps };
