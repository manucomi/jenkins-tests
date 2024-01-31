import Header from 'mfe-core/ui/Header';
import Title from 'components/Title/Title';
import ArticleWrapper from 'components/ArticleWrapper/ArticleWrapper';
import RecommendedForYou from 'components/RecommendedForYou/RecommendedForYou';
import BigIdeaHeadline from 'components/BigIdeaHeadline/BigIdeaHeadline';
import { setupParser } from 'mfe-articles-renderer';
import useArticleStore from 'stores/article/article.store';
import MainTopicLink from 'components/MainTopicLink/MainTopicLink';
import PageUtils from 'components/PageUtils/PageUtils';
import Hero from 'components/Hero/Hero';
import PublicationDate from 'components/PublicationDate/PublicationDate';
import styles from './BigIdea.module.scss';
import AuthorBioList from '../../components/AuthorBioList/AuthorBioList';

// Just for demonstration purpose to show how to pass custom resolvers in the setupParser
/* istanbul ignore next */
// eslint-disable-next-line react/function-component-definition, react/prop-types
const CustomLinkComponent = ({ children }) => {
    const text = children;
    return <span style={{ color: 'red' }}>{text}</span>;
};

function AppHBRComponent() {
    return (
        <div style={{ border: '2px solid #c82502' }}>
            App HBRComponent Resolver for newsletter type
        </div>
    );
}

function BigIdea() {
    const article = useArticleStore((state) => state.article);
    const config = {
        customResolvers: {
            // 'hbr-component': AppHBRComponent, to override all default hbr-component resolvers
            a: CustomLinkComponent,
        },
        hbrComponentOverrides: {
            newsletters: AppHBRComponent,
        },
    };
    const parseContent = setupParser(config);
    const parsedContent = parseContent(article.content);
    return (
        <>
            <Header showAd={false}>
                <BigIdeaHeadline onHeader />
            </Header>
            <ArticleWrapper>
                <div className={styles['hero-image']}>
                    <Hero />
                </div>
                <div className={styles.container}>
                    <div className={styles['article-header']}>
                        <MainTopicLink />
                        <BigIdeaHeadline />
                        <Title />
                        <PublicationDate />
                    </div>
                    <div className={styles['top-series-nav']}>
                        Top series nav
                    </div>
                    <div className={styles['left-rail']}>
                        <PageUtils position={PageUtils.position.LEFT} />
                    </div>
                    <div className={styles.content}>
                        <div>{parsedContent}</div>
                    </div>
                    <div className={styles['right-rail']}>Right column </div>
                    <div className={styles.author}>
                        <AuthorBioList />
                    </div>
                    <div className={styles['bottom-utils']}>
                        <PublicationDate
                            position={PublicationDate.variants.BOTTOM}
                        />
                        <PageUtils position={PageUtils.position.BOTTOM} />
                    </div>
                    <div className={styles['bottom-series-nav']}>
                        Bottom series nav
                    </div>
                    <div className={styles['bottom-related-topics']}>
                        Bottom related topics
                    </div>
                </div>
            </ArticleWrapper>
            <RecommendedForYou />
        </>
    );
}

export default BigIdea;
